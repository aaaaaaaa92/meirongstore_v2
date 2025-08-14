'use client'

import { useState, useEffect } from 'react'
import { supabase, Booking } from '@/lib/supabase'
import AdminBookingList from '@/components/AdminBookingList'
import { Shield, Home, Calendar, BarChart3, Users, Settings } from 'lucide-react'
import Link from 'next/link'

export default function AdminPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  
  // 简单的密码验证 (生产环境中应该使用更安全的方式)
  const ADMIN_PASSWORD = 'admin123'

  useEffect(() => {
    // 检查是否已经验证过
    const authStatus = localStorage.getItem('admin_authenticated')
    if (authStatus === 'true') {
      setIsAuthenticated(true)
      loadBookings()
    } else {
      setLoading(false)
    }
  }, [])

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      localStorage.setItem('admin_authenticated', 'true')
      loadBookings()
    } else {
      alert('密码错误！')
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('admin_authenticated')
    setPassword('')
  }

  const loadBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          service:services(*)
        `)
        .order('appointment_date', { ascending: false })
        .order('appointment_time', { ascending: false })
      
      if (error) throw error
      setBookings(data || [])
    } catch (error) {
      console.error('加载预约失败:', error)
    } finally {
      setLoading(false)
    }
  }

  // 登录界面
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <div className="text-center mb-6">
            <div className="mx-auto w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">管理员登录</h1>
            <p className="text-gray-600 mt-2">请输入管理员密码</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                管理员密码
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="请输入密码"
              />
            </div>
            
            <button
              onClick={handleLogin}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              登录
            </button>
            
            <div className="text-center">
              <Link 
                href="/" 
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                返回客户端
              </Link>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>测试密码：</strong> admin123
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 管理员导航栏 */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">管理员控制台</h1>
                <p className="text-gray-600 text-sm">美容预约系统后台管理</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link 
                href="/"
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-100"
              >
                <Home className="h-4 w-4" />
                <span>客户端</span>
              </Link>
              
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                退出登录
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 侧边导航 */}
      <div className="flex">
        <nav className="w-64 bg-white shadow-sm h-screen sticky top-0">
          <div className="p-4">
            <ul className="space-y-2">
              <li>
                <a 
                  href="#" 
                  className="flex items-center space-x-3 p-3 rounded-lg bg-blue-50 text-blue-700 font-medium"
                >
                  <Calendar className="h-5 w-5" />
                  <span>预约管理</span>
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="flex items-center space-x-3 p-3 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                >
                  <BarChart3 className="h-5 w-5" />
                  <span>数据统计</span>
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="flex items-center space-x-3 p-3 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                >
                  <Users className="h-5 w-5" />
                  <span>客户管理</span>
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="flex items-center space-x-3 p-3 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                >
                  <Settings className="h-5 w-5" />
                  <span>系统设置</span>
                </a>
              </li>
            </ul>
          </div>
        </nav>

        {/* 主要内容区域 */}
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">预约管理</h2>
            <p className="text-gray-600 mt-1">查看和管理所有客户预约</p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <AdminBookingList 
              bookings={bookings} 
              onUpdate={loadBookings}
            />
          )}
        </main>
      </div>
    </div>
  )
}
