import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  User,
  Bell,
  Lock,
  Monitor,
  Globe,
  Shield,
  Save,
  Mail,
  Building2,
  Smartphone,
  Key
} from 'lucide-react';

export default function Settings() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    alerts: true,
    maintenance: true,
    energy: false,
    security: true
  });
  const [appearance, setAppearance] = useState({
    theme: 'dark',
    language: 'en',
    sidebarCollapsed: false
  });

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'appearance', label: 'Appearance', icon: Monitor }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Settings</h1>
        <p className="text-gray-500 dark:text-gray-400">Manage your account and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border p-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary-500/10 text-primary-500'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {activeTab === 'profile' && (
            <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border p-6">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">Profile Settings</h2>
              
              <div className="flex items-center gap-6 mb-8">
                <div className="w-20 h-20 rounded-full bg-primary-500/20 flex items-center justify-center">
                  <User className="w-10 h-10 text-primary-500" />
                </div>
                <div>
                  <button className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600">
                    Change Photo
                  </button>
                  <p className="text-sm text-gray-500 mt-2">JPG, PNG. Max 2MB</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    defaultValue={user?.firstName || ''}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-card text-gray-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    defaultValue={user?.lastName || ''}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-card text-gray-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    defaultValue={user?.email || ''}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-card text-gray-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Department
                  </label>
                  <input
                    type="text"
                    defaultValue={user?.department || ''}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-card text-gray-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Role
                  </label>
                  <input
                    type="text"
                    defaultValue={user?.role || 'viewer'}
                    disabled
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    defaultValue={user?.username || ''}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-card text-gray-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                <button className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border p-6">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">Notification Preferences</h2>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-800 dark:text-white">Email Notifications</p>
                      <p className="text-sm text-gray-500">Receive alerts via email</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setNotifications({ ...notifications, email: !notifications.email })}
                    className={`w-12 h-6 rounded-full transition-colors ${notifications.email ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${notifications.email ? 'translate-x-6' : 'translate-x-0.5'}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-800 dark:text-white">Push Notifications</p>
                      <p className="text-sm text-gray-500">Receive push notifications on your device</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setNotifications({ ...notifications, push: !notifications.push })}
                    className={`w-12 h-6 rounded-full transition-colors ${notifications.push ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${notifications.push ? 'translate-x-6' : 'translate-x-0.5'}`} />
                  </button>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="font-medium text-gray-800 dark:text-white mb-4">Alert Types</p>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Critical Alerts</span>
                      <button
                        onClick={() => setNotifications({ ...notifications, alerts: !notifications.alerts })}
                        className={`w-12 h-6 rounded-full transition-colors ${notifications.alerts ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full transition-transform ${notifications.alerts ? 'translate-x-6' : 'translate-x-0.5'}`} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Maintenance Updates</span>
                      <button
                        onClick={() => setNotifications({ ...notifications, maintenance: !notifications.maintenance })}
                        className={`w-12 h-6 rounded-full transition-colors ${notifications.maintenance ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full transition-transform ${notifications.maintenance ? 'translate-x-6' : 'translate-x-0.5'}`} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Energy Reports</span>
                      <button
                        onClick={() => setNotifications({ ...notifications, energy: !notifications.energy })}
                        className={`w-12 h-6 rounded-full transition-colors ${notifications.energy ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full transition-transform ${notifications.energy ? 'translate-x-6' : 'translate-x-0.5'}`} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Security Alerts</span>
                      <button
                        onClick={() => setNotifications({ ...notifications, security: !notifications.security })}
                        className={`w-12 h-6 rounded-full transition-colors ${notifications.security ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full transition-transform ${notifications.security ? 'translate-x-6' : 'translate-x-0.5'}`} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border p-6">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">Security Settings</h2>
              
              <div className="space-y-6">
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <Key className="w-5 h-5 text-primary-500" />
                    <h3 className="font-medium text-gray-800 dark:text-white">Change Password</h3>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">Update your password regularly to keep your account secure</p>
                  <button className="px-4 py-2 border border-primary-500 text-primary-500 rounded-lg hover:bg-primary-500/10">
                    Change Password
                  </button>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <Shield className="w-5 h-5 text-primary-500" />
                    <h3 className="font-medium text-gray-800 dark:text-white">Two-Factor Authentication</h3>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">Add an extra layer of security to your account</p>
                  <button className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600">
                    Enable 2FA
                  </button>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="font-medium text-gray-800 dark:text-white mb-4">Active Sessions</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-800 dark:text-white">Current Session</p>
                        <p className="text-sm text-gray-500">Chrome on Windows • Last active now</p>
                      </div>
                      <span className="px-2 py-1 bg-green-500/10 text-green-500 rounded text-xs">Active</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border p-6">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">Appearance Settings</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Theme
                  </label>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setAppearance({ ...appearance, theme: 'light' })}
                      className={`flex-1 p-4 rounded-lg border-2 ${appearance.theme === 'light' ? 'border-primary-500 bg-primary-500/10' : 'border-gray-200 dark:border-gray-700'}`}
                    >
                      <div className="w-full h-20 bg-white border border-gray-200 rounded mb-2" />
                      <p className="text-sm font-medium">Light</p>
                    </button>
                    <button
                      onClick={() => setAppearance({ ...appearance, theme: 'dark' })}
                      className={`flex-1 p-4 rounded-lg border-2 ${appearance.theme === 'dark' ? 'border-primary-500 bg-primary-500/10' : 'border-gray-200 dark:border-gray-700'}`}
                    >
                      <div className="w-full h-20 bg-gray-800 border border-gray-700 rounded mb-2" />
                      <p className="text-sm font-medium">Dark</p>
                    </button>
                    <button
                      onClick={() => setAppearance({ ...appearance, theme: 'system' })}
                      className={`flex-1 p-4 rounded-lg border-2 ${appearance.theme === 'system' ? 'border-primary-500 bg-primary-500/10' : 'border-gray-200 dark:border-gray-700'}`}
                    >
                      <div className="w-full h-20 bg-gradient-to-r from-white to-gray-800 border border-gray-200 rounded mb-2" />
                      <p className="text-sm font-medium">System</p>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Language
                  </label>
                  <select
                    value={appearance.language}
                    onChange={(e) => setAppearance({ ...appearance, language: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-card text-gray-800 dark:text-white"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                    <option value="zh">Chinese</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
