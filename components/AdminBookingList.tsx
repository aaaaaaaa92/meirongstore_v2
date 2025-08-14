'use client'

import { useState, useMemo } from 'react'
import { supabase, Booking } from '@/lib/supabase'
import { Search, Filter, Calendar, Clock, User, Phone, AlertCircle, CheckCircle, XCircle, MoreHorizontal } from 'lucide-react'

interface AdminBookingListProps {
  bookings: Booking[]
  onUpdate: () => void
}

export default function AdminBookingList({ bookings, onUpdate }: AdminBookingListProps) {
  const [searchPhone, setSearchPhone] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState<'date' | 'status' | 'created'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  // 过滤和排序预约
  const filteredAndSortedBookings = useMemo(() => {
    let filtered = bookings.filter(booking => {
      const phoneMatch = searchPhone === '' || booking.customer_phone?.includes(searchPhone)
      const statusMatch = statusFilter === 'all' || booking.status === statusFilter
      return phoneMatch && statusMatch
    })

    // 排序
    filtered.sort((a, b) => {
      let comparison = 0
      
      switch (sortBy) {
        case 'date':
          const aDateTime = new Date(`${a.appointment_date} ${a.appointment_time}`)
          const bDateTime = new Date(`${b.appointment_date} ${b.appointment_time}`)
          comparison = aDateTime.getTime() - bDateTime.getTime()
          break
        case 'status':
          comparison = (a.status || '').localeCompare(b.status || '')
          break
        case 'created':
          comparison = new Date(a.created_at || '').getTime() - new Date(b.created_at || '').getTime()
          break
      }
      
      return sortOrder === 'asc' ? comparison : -comparison
    })

    return filtered
  }, [bookings, searchPhone, statusFilter, sortBy, sortOrder])

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', bookingId)

      if (error) throw error
      onUpdate()
    } catch (error) {
      console.error('更新预约状态失败:', error)
      alert('更新失败，请重试')
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

  const getStatusActions = (booking: Booking) => {
    const actions = []
    
    switch (booking.status) {
      case 'pending':
        actions.push(
          <button
            key="confirm"
            onClick={() => updateBookingStatus(booking.id, 'confirmed')}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            确认
          </button>
        )
        actions.push(
          <button
            key="cancel"
            onClick={() => updateBookingStatus(booking.id, 'cancelled')}
            className="text-red-600 hover:text-red-800 text-sm font-medium"
          >
            取消
          </button>
        )
        break
      case 'confirmed':
        actions.push(
          <button
            key="complete"
            onClick={() => updateBookingStatus(booking.id, 'completed')}
            className="text-green-600 hover:text-green-800 text-sm font-medium"
          >
            完成
          </button>
        )
        actions.push(
          <button
            key="cancel"
            onClick={() => updateBookingStatus(booking.id, 'cancelled')}
            className="text-red-600 hover:text-red-800 text-sm font-medium"
          >
            取消
          </button>
        )
        break
      default:
        return <span className="text-gray-400 text-sm">无操作</span>
    }

    return (
      <div className="flex gap-2">
        {actions}
      </div>
    )
  }

  // 统计数据
  const stats = useMemo(() => {
    const total = bookings.length
    const pending = bookings.filter(b => b.status === 'pending').length
    const confirmed = bookings.filter(b => b.status === 'confirmed').length
    const completed = bookings.filter(b => b.status === 'completed').length
    const cancelled = bookings.filter(b => b.status === 'cancelled').length
    
    return { total, pending, confirmed, completed, cancelled }
  }, [bookings])

  return (
    <div className="space-y-6">
      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-gray-600 text-sm">总预约</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          <div className="text-gray-600 text-sm">待确认</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="text-2xl font-bold text-blue-600">{stats.confirmed}</div>
          <div className="text-gray-600 text-sm">已确认</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          <div className="text-gray-600 text-sm">已完成</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="text-2xl font-bold text-red-600">{stats.cancelled}</div>
          <div className="text-gray-600 text-sm">已取消</div>
        </div>
      </div>

      {/* 搜索和过滤 */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="搜索手机号..."
                value={searchPhone}
                onChange={(e) => setSearchPhone(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div className="flex gap-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">全部状态</option>
              <option value="pending">待确认</option>
              <option value="confirmed">已确认</option>
              <option value="completed">已完成</option>
              <option value="cancelled">已取消</option>
            </select>
            
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [by, order] = e.target.value.split('-')
                setSortBy(by as 'date' | 'status' | 'created')
                setSortOrder(order as 'asc' | 'desc')
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="date-desc">预约时间 ↓</option>
              <option value="date-asc">预约时间 ↑</option>
              <option value="created-desc">创建时间 ↓</option>
              <option value="created-asc">创建时间 ↑</option>
              <option value="status-asc">状态 A-Z</option>
              <option value="status-desc">状态 Z-A</option>
            </select>
          </div>
        </div>
      </div>

      {/* 预约列表 */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">客户信息</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">服务项目</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">预约时间</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">状态</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredAndSortedBookings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                    暂无预约记录
                  </td>
                </tr>
              ) : (
                filteredAndSortedBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <div>
                          <div className="font-medium text-gray-900">{booking.customer_name}</div>
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Phone className="h-3 w-3" />
                            {booking.customer_phone}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{booking.service?.name}</div>
                        <div className="text-sm text-gray-500">
                          ¥{booking.service?.price} · {booking.service?.duration}分钟
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <div>
                          <div className="font-medium text-gray-900">
                            {new Date(booking.appointment_date).toLocaleDateString('zh-CN', {
                              month: 'long',
                              day: 'numeric',
                              weekday: 'short'
                            })}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Clock className="h-3 w-3" />
                            {booking.appointment_time}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      {getStatusBadge(booking.status || 'pending')}
                    </td>
                    <td className="px-4 py-4">
                      {getStatusActions(booking)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {filteredAndSortedBookings.length > 0 && (
        <div className="text-sm text-gray-500 text-center">
          显示 {filteredAndSortedBookings.length} 条预约记录，共 {bookings.length} 条
        </div>
      )}
    </div>
  )
}
