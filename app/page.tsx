'use client'

import { useState, useEffect } from 'react'
import { supabase, Service } from '@/lib/supabase'
import BookingForm from '@/components/BookingForm'
import CustomerBookingQuery from '@/components/CustomerBookingQuery'
import { Calendar, Search, Star, Phone, Settings } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  const [activeTab, setActiveTab] = useState<'book' | 'query'>('book')
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadServices()
  }, [])

  const loadServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('name')
      
      if (error) throw error
      setServices(data || [])
    } catch (error) {
      console.error('加载服务失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleBookingSuccess = () => {
    setActiveTab('query')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-pink-500 p-2 rounded-lg">
                <Star className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">美容预约系统</h1>
                <p className="text-gray-600">专业美容服务，在线预约</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-gray-600">
                <Phone className="h-4 w-4" />
                <span>400-123-4567</span>
              </div>
              <Link 
                href="/admin"
                className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Settings className="h-4 w-4" />
                <span>管理后台</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('book')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'book'
                  ? 'border-pink-500 text-pink-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>在线预约</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('query')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'query'
                  ? 'border-pink-500 text-pink-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4" />
                <span>查询预约</span>
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
          </div>
        ) : (
          <>
            {activeTab === 'book' && (
              <BookingForm 
                services={services} 
                onSuccess={handleBookingSuccess}
              />
            )}
            {activeTab === 'query' && (
              <CustomerBookingQuery />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-16">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">美容预约系统</h3>
              <p className="text-gray-300">
                提供专业的美容服务，让您美丽每一天
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">服务时间</h3>
              <p className="text-gray-300">
                周一至周日：9:00 - 21:00
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">联系我们</h3>
              <p className="text-gray-300">
                电话：400-123-4567<br />
                地址：北京市朝阳区xxx路xxx号
              </p>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 . All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}





