import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  UserCheck,
  Users2,
  CreditCard,
  GraduationCap,
  Bus,
  Settings,
  LogOut,
  School,
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Teachers', href: '/teachers', icon: Users },
  { name: 'Subjects', href: '/subjects', icon: BookOpen },
  { name: 'Students', href: '/students', icon: GraduationCap },
  { name: 'Parents', href: '/parents', icon: UserCheck },
  { name: 'Staff', href: '/staff', icon: Users2 },
  { name: 'Payments', href: '/payments', icon: CreditCard },
  { name: 'Grades', href: '/grades', icon: BookOpen },
  { name: 'Transport', href: '/transport', icon: Bus },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const location = useLocation();
  const { logout } = useApp();

  return (
    <div className="flex h-full w-64 flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2 p-6 border-b border-gray-200 dark:border-gray-700">
        <School className="h-8 w-8 text-primary" />
        <span className="text-xl font-bold text-gray-900 dark:text-white">
          SchoolAdmin
        </span>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <Button
          variant="ghost"
          onClick={logout}
          className="w-full justify-start gap-3 text-gray-700 dark:text-gray-300"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </Button>
      </div>
    </div>
  );
}