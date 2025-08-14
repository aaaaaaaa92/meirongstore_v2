'use client'

import { useState } from 'react'
import { supabase, Booking } from '@/lib/supabase'
import { Search, Calendar, Clock, User, Phone, AlertCircle, CheckCircle, XCircle } from 'lucide-react'

export default function CustomerBookingQuery() {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  const searchBookings = async () => {
    if (!phoneNumber.trim()) {
      alert('请输入手机号')
      return
    }

    if (!/^1[3-9]\d{9}$/.test(phoneNumber)) {
      alert('请输入正确的手机号格式')
      return
    }

    setLoading(true)
    setHasSearched(true)

    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          service:services(*)
        `)
        .eq('customer_phone', phoneNumber)
        .order('appointment_date', { ascending: false })
        .order('appointment_time', { ascending: false })

      if (error) throw error
      setBookings(data || [])
    } catch (error) {
      console.error('查询预约失败:', error)
      alert('查询失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      'pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'confirmed': 'bg-blue-100 text-blue-800 border-blue-200',
      'completed': 'bg-green-100 text-green-800 border-green-200',
      'cancelled': 'bg-red-100 text-red-800 border-red-200'
    }

    const labels = {
      'pending': '待确认',
      'confirmed': '已确认',
      'completed': '已完成',
      'cancelled': '已取消'
    }

    const icons = {
      'pending': <AlertCircle className="h-3 w-3" />,
      'confirmed': <CheckCircle className="h-3 w-3" />,
      'completed': <CheckCircle className="h-3 w-3" />,
      'cancelled': <XCircle className="h-3 w-3" />
    }

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${styles[status as keyof typeof styles] || styles.pending}`}>
        {icons[status as keyof typeof icons] || icons.pending}
        {labels[status as keyof typeof labels] || '未知'}
      </span>
    )
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      searchBookings()
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* 搜索区域 */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">查询我的预约</h2>
          <p className="text-gray-600">输入预约时使用的手机号查询您的预约记录</p>
        </div>

        <div className="max-w-md mx-auto">
          <div className="flex gap-3">
            <div className="flex-1">
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="请输入手机号（如：13800138000）"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                maxLength={11}
              />
            </div>
            <button
              onClick={searchBookings}
              disabled={loading}
              className="px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
            >
              <Search className="h-4 w-4" />
              {loading ? '查询中...' : '查询预约'}
            </button>
          </div>
        </div>
      </div>

      {/* 查询结果 */}
      {hasSearched && (
        <div className="bg-white rounded-lg shadow-sm">
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Calendar className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">暂无预约记录</h3>
              <p className="text-gray-600">
                手机号 <span className="font-medium">{phoneNumber}</span> 暂无预约记录
              </p>
              <p className="text-gray-500 text-sm mt-2">
                请确认手机号是否正确，或联系客服咨询
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              <div className="px-6 py-4 bg-gray-50">
                <h3 className="text-lg font-medium text-gray-900">
                  找到 {bookings.length} 条预约记录
                </h3>
                <p className="text-gray-600 text-sm">
                  手机号：{phoneNumber}
                </p>
              </div>
              
              {bookings.map((booking) => (
                <div key={booking.id} className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* 预约信息 */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-lg font-medium text-gray-900">
                          {booking.service?.name}
                        </h4>
                        {getStatusBadge(booking.status || 'pending')}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {new Date(booking.appointment_date).toLocaleDateString('zh-CN', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              weekday: 'long'
                            })}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-gray-600">
                          <Clock className="h-4 w-4" />
                          <span>{booking.appointment_time}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-gray-600">
                          <User className="h-4 w-4" />
                          <span>{booking.customer_name}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-gray-600">
                          <Phone className="h-4 w-4" />
                          <span>{booking.customer_phone}</span>
                        </div>
                      </div>
                      
                      {booking.service && (
                        <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                          <div className="flex justify-between items-center mb-1">
                            <span>服务价格：</span>
                            <span className="font-medium text-gray-900">¥{booking.service.price}</span>
                          </div>
                          <div className="flex justify-between items-center mb-1">
                            <span>服务时长：</span>
                            <span className="font-medium text-gray-900">{booking.service.duration} 分钟</span>
                          </div>
                          {booking.service.description && (
                            <div className="mt-2 pt-2 border-t border-gray-200">
                              <span className="text-gray-500">服务介绍：</span>
                              <span className="text-gray-700">{booking.service.description}</span>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {booking.notes && (
                        <div className="text-sm">
                          <span className="text-gray-500">备注：</span>
                          <span className="text-gray-700">{booking.notes}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* 预约时间信息 */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="text-xs text-gray-500">
                      预约创建时间：{new Date(booking.created_at || '').toLocaleString('zh-CN')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 提示信息 */}
      {!hasSearched && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-blue-600" />
            </div>
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">温馨提示</p>
              <ul className="space-y-1 text-blue-700">
                <li>• 请输入预约时使用的手机号进行查询</li>
                <li>• 只能查询到该手机号相关的预约记录</li>
                <li>• 如有疑问，请联系客服：400-123-4567</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
