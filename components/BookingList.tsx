'use client'

import { useState } from 'react'
import { supabase, Booking } from '@/lib/supabase'
import { format } from 'date-fns'
import { Calendar, Clock, User, Phone, MessageSquare, Search, Filter } from 'lucide-react'

interface BookingListProps {
  bookings: Booking[]
  onUpdate: () => void
}

export default function BookingList({ bookings, onUpdate }: BookingListProps) {
  const [searchPhone, setSearchPhone] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [loading, setLoading] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'customer' | 'admin'>('customer')
  const [customerPhone, setCustomerPhone] = useState('')
  const [showCustomerBookings, setShowCustomerBookings] = useState(false)

  // 过滤预约
  const filteredBookings = bookings.filter(booking => {
    // 如果是客户模式且已验证手机号，只显示该客户的预约
    if (viewMode === 'customer' && showCustomerBookings && customerPhone) {
      if (booking.customer_phone !== customerPhone) return false
    }
    
    // 如果是管理员模式，使用原有的搜索逻辑
    if (viewMode === 'admin') {
      const phoneMatch = !searchPhone || booking.customer_phone?.includes(searchPhone)
      const statusMatch = statusFilter === 'all' || booking.status === statusFilter
      return phoneMatch && statusMatch
    }
    
    // 客户模式下，如果没有验证手机号，不显示任何预约
    if (viewMode === 'customer' && !showCustomerBookings) {
      return false
    }
    
    return true
  })

  // 客户查询预约
  const handleCustomerSearch = () => {
    if (customerPhone.trim() === '') {
      alert('请输入手机号码')
      return
    }
    if (!/^1[3-9]\d{9}$/.test(customerPhone)) {
      alert('请输入有效的手机号码')
      return
    }
    setShowCustomerBookings(true)
  }

  // 更新预约状态
  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    setLoading(bookingId)
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', bookingId)

      if (error) throw error
      onUpdate()
    } catch (error) {
      console.error('更新状态失败:', error)
      alert('更新失败，请稍后重试')
    } finally {
      setLoading(null)
    }
  }

  // 状态标签样式
  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    }
    
    const labels = {
      pending: '待确认',
      confirmed: '已确认',
      completed: '已完成',
      cancelled: '已取消'
    }

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card">
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center mb-4 sm:mb-0">
              <Clock className="h-6 w-6 mr-2 text-primary-500" />
              预约查询
            </h2>
            
            {/* 切换视图模式 */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => {
                  setViewMode('customer')
                  setShowCustomerBookings(false)
                  setCustomerPhone('')
                }}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'customer'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                客户查询
              </button>
              <button
                onClick={() => setViewMode('admin')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'admin'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                管理员
              </button>
            </div>
          </div>

          {/* 客户查询界面 */}
          {viewMode === 'customer' && (
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <h3 className="text-lg font-medium text-gray-900 mb-3">查询我的预约</h3>
              <div className="flex gap-3">
                <div className="flex-1">
                  <input
                    type="tel"
                    placeholder="请输入您的手机号码"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <button
                  onClick={handleCustomerSearch}
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  查询预约
                </button>
              </div>
              {showCustomerBookings && (
                <p className="mt-2 text-sm text-gray-600">
                  显示手机号 {customerPhone} 的预约记录
                </p>
              )}
            </div>
          )}

          {/* 管理员搜索和过滤 */}
          {viewMode === 'admin' && (
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="搜索手机号..."
                  value={searchPhone}
                  onChange={(e) => setSearchPhone(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none bg-white"
                >
                  <option value="all">全部状态</option>
                  <option value="pending">待确认</option>
                  <option value="confirmed">已确认</option>
                  <option value="completed">已完成</option>
                  <option value="cancelled">已取消</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {filteredBookings.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">暂无预约记录</h3>
            <p className="text-gray-500">
              {searchPhone || statusFilter !== 'all' 
                ? '没有找到符合条件的预约记录' 
                : '还没有任何预约，快去预约吧！'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <div key={booking.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-medium text-gray-900">
                        {booking.service?.name}
                      </h3>
                      {getStatusBadge(booking.status)}
                    </div>
                    
                    <div className="grid sm:grid-cols-2 gap-3 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                        <span>
                          {format(new Date(booking.appointment_date), 'yyyy年MM月dd日')}
                        </span>
                      </div>
                      
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-gray-400" />
                        <span>{booking.appointment_time}</span>
                      </div>
                      
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2 text-gray-400" />
                        <span>{booking.customer_name}</span>
                      </div>
                      
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-gray-400" />
                        <span>{booking.customer_phone}</span>
                      </div>
                    </div>

                    {booking.service && (
                      <div className="mt-2 text-sm text-gray-600">
                        <span className="font-medium">¥{booking.service.price}</span>
                        <span className="mx-2">•</span>
                        <span>{booking.service.duration}分钟</span>
                      </div>
                    )}

                    {booking.notes && (
                      <div className="mt-3 flex items-start">
                        <MessageSquare className="h-4 w-4 mr-2 text-gray-400 mt-0.5" />
                        <span className="text-sm text-gray-600">{booking.notes}</span>
                      </div>
                    )}
                  </div>

                  {/* 操作按钮 - 只有管理员模式下才显示 */}
                  {viewMode === 'admin' && (
                    <div className="mt-4 lg:mt-0 lg:ml-6 flex flex-wrap gap-2">
                      {booking.status === 'pending' && (
                        <>
                          <button
                            onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                            disabled={loading === booking.id}
                            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                          >
                            {loading === booking.id ? '处理中...' : '确认'}
                          </button>
                          <button
                            onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                            disabled={loading === booking.id}
                            className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                          >
                            取消
                          </button>
                        </>
                      )}
                      
                      {booking.status === 'confirmed' && (
                        <button
                          onClick={() => updateBookingStatus(booking.id, 'completed')}
                          disabled={loading === booking.id}
                          className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                        >
                          {loading === booking.id ? '处理中...' : '完成'}
                        </button>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="mt-3 text-xs text-gray-500">
                  预约时间：{format(new Date(booking.created_at), 'yyyy-MM-dd HH:mm')}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}





