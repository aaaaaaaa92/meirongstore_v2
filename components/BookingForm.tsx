'use client'

import { useState } from 'react'
import * as React from 'react'
import { supabase, Service } from '@/lib/supabase'
import { useForm } from 'react-hook-form'
import { format, addDays, isBefore, startOfDay } from 'date-fns'
import { Calendar, Clock, User, Phone, MessageSquare } from 'lucide-react'

interface BookingFormProps {
  services: Service[]
  onSuccess: () => void
}

interface BookingFormData {
  serviceId: string
  appointmentDate: string
  appointmentTime: string
  customerName: string
  customerPhone: string
  notes?: string
}

// 生成可用的时间段
const generateTimeSlots = () => {
  const slots = []
  for (let hour = 9; hour <= 20; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
      slots.push(timeString)
    }
  }
  return slots
}

// 生成可预约的日期（未来30天）
const generateAvailableDates = () => {
  const dates = []
  const today = startOfDay(new Date())
  const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  
  for (let i = 0; i < 30; i++) {
    const date = addDays(today, i)
    const dayOfWeek = weekDays[date.getDay()]
    dates.push({
      value: format(date, 'yyyy-MM-dd'),
      label: `${format(date, 'MM月dd日')} (${dayOfWeek})`
    })
  }
  return dates
}

export default function BookingForm({ services, onSuccess }: BookingFormProps) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [bookedSlots, setBookedSlots] = useState<string[]>([])
  
  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm<BookingFormData>()

  const selectedServiceId = watch('serviceId')
  const selectedDate = watch('appointmentDate')
  const selectedService = services.find(s => s.id === selectedServiceId)

  const timeSlots = generateTimeSlots()
  const availableDates = generateAvailableDates()

  // 检查已预约的时间段
  const checkBookedSlots = async (serviceId: string, date: string) => {
    if (!serviceId || !date) {
      setBookedSlots([])
      return
    }

    try {
      // 检查指定日期的所有预约（不限服务类型）
      const { data, error } = await supabase
        .from('bookings')
        .select('appointment_time, service:services(name)')
        .eq('appointment_date', date)
        .neq('status', 'cancelled') // 排除已取消的预约

      if (error) throw error
      
      // 将数据库的时间格式 (HH:MM:SS) 转换为前端格式 (HH:MM)
      const bookedTimes = data?.map(booking => {
        const timeStr = booking.appointment_time
        return timeStr.includes(':') && timeStr.length > 5 ? timeStr.substring(0, 5) : timeStr
      }) || []
      
      // 去重，因为可能有多个服务在同一时间段
      const uniqueBookedTimes = Array.from(new Set(bookedTimes))
      
      setBookedSlots(uniqueBookedTimes)
    } catch (error) {
      console.error('检查预约时间段失败:', error)
    }
  }

  // 当服务或日期改变时检查已预约时间段
  React.useEffect(() => {
    checkBookedSlots(selectedServiceId, selectedDate)
  }, [selectedServiceId, selectedDate])

  const onSubmit = async (data: BookingFormData) => {
    setLoading(true)
    setMessage(null)

    try {
      // 先检查是否有重复预约（检查所有服务，不限服务类型）
      const { data: existingBookings, error: checkError } = await supabase
        .from('bookings')
        .select('*, service:services(name)')
        .eq('appointment_date', data.appointmentDate)
        .eq('appointment_time', data.appointmentTime)
        .neq('status', 'cancelled') // 排除已取消的预约

      if (checkError) {
        throw checkError
      }

      if (existingBookings && existingBookings.length > 0) {
        const existingService = existingBookings[0].service?.name || '其他服务'
        throw new Error(`该时间段已被预约（${existingService}），请选择其他时间`)
      }

      // 插入新预约
      const { error } = await supabase
        .from('bookings')
        .insert([
          {
            service_id: data.serviceId,
            appointment_date: data.appointmentDate,
            appointment_time: data.appointmentTime,
            customer_name: data.customerName,
            customer_phone: data.customerPhone,
            notes: data.notes,
            status: 'pending'
          }
        ])

      if (error) {
        if (error.code === '23505') {
          throw new Error('该服务在此时间段已被预约，请选择其他时间')
        }
        throw error
      }

      setMessage({ type: 'success', text: '预约成功！我们会尽快联系您确认。' })
      reset()
      onSuccess()
    } catch (error) {
      console.error('预约失败:', error)
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : '预约失败，请稍后重试' 
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <Calendar className="h-6 w-6 mr-2 text-primary-500" />
          在线预约
        </h2>

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-700' 
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* 选择服务 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              选择服务 *
            </label>
            <select
              {...register('serviceId', { required: '请选择服务项目' })}
              className="input-field w-full"
            >
              <option value="">请选择服务项目</option>
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name} - ¥{service.price} ({service.duration}分钟)
                </option>
              ))}
            </select>
            {errors.serviceId && (
              <p className="mt-1 text-sm text-red-600">{errors.serviceId.message}</p>
            )}
          </div>

          {/* 服务详情 */}
          {selectedService && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900">{selectedService.name}</h3>
              {selectedService.description && (
                <p className="text-gray-600 text-sm mt-1">{selectedService.description}</p>
              )}
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                <span>¥{selectedService.price}</span>
                <span>{selectedService.duration}分钟</span>
              </div>
            </div>
          )}

          {/* 选择日期 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              预约日期 *
            </label>
            <select
              {...register('appointmentDate', { required: '请选择预约日期' })}
              className="input-field w-full"
            >
              <option value="">请选择日期</option>
              {availableDates.map((date) => (
                <option key={date.value} value={date.value}>
                  {date.label}
                </option>
              ))}
            </select>
            {errors.appointmentDate && (
              <p className="mt-1 text-sm text-red-600">{errors.appointmentDate.message}</p>
            )}
          </div>

          {/* 选择时间 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              预约时间 *
            </label>
            <div className="grid grid-cols-4 gap-2">
              {timeSlots.map((time) => {
                const isBooked = bookedSlots.includes(time)

                return (
                  <label key={time} className={`relative ${isBooked ? 'pointer-events-none' : ''}`}>
                    <input
                      type="radio"
                      value={time}
                      disabled={isBooked}
                      {...register('appointmentTime', { required: '请选择预约时间' })}
                      className="sr-only peer"
                    />
                    <div className={`p-2 text-center text-sm border rounded transition-colors ${
                      isBooked 
                        ? 'border-red-300 bg-red-100 text-red-500 cursor-not-allowed opacity-75' 
                        : 'border-gray-300 cursor-pointer peer-checked:bg-primary-500 peer-checked:text-white peer-checked:border-primary-500 hover:border-primary-300'
                    }`}>
                      {time}
                      {isBooked && <span className="block text-xs text-red-600 font-medium">已预约</span>}
                    </div>
                  </label>
                )
              })}
            </div>
            {errors.appointmentTime && (
              <p className="mt-1 text-sm text-red-600">{errors.appointmentTime.message}</p>
            )}
          </div>

          {/* 客户信息 */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="h-4 w-4 inline mr-1" />
                姓名 *
              </label>
              <input
                type="text"
                {...register('customerName', { required: '请输入姓名' })}
                className="input-field w-full"
                placeholder="请输入您的姓名"
              />
              {errors.customerName && (
                <p className="mt-1 text-sm text-red-600">{errors.customerName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="h-4 w-4 inline mr-1" />
                电话 *
              </label>
              <input
                type="tel"
                {...register('customerPhone', { 
                  required: '请输入电话号码',
                  pattern: {
                    value: /^1[3-9]\d{9}$/,
                    message: '请输入有效的手机号码'
                  }
                })}
                className="input-field w-full"
                placeholder="请输入手机号码"
              />
              {errors.customerPhone && (
                <p className="mt-1 text-sm text-red-600">{errors.customerPhone.message}</p>
              )}
            </div>
          </div>

          {/* 备注 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MessageSquare className="h-4 w-4 inline mr-1" />
              备注
            </label>
            <textarea
              {...register('notes')}
              rows={3}
              className="input-field w-full"
              placeholder="有什么特殊要求吗？（可选）"
            />
          </div>

          {/* 提交按钮 */}
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                预约中...
              </div>
            ) : (
              '确认预约'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
