'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, UserRole } from '@/lib/auth-context';
import {
  HiOutlineLockClosed,
  HiOutlineMail,
  HiOutlineUser,
  HiOutlineCurrencyDollar,
  HiOutlineCog,
} from 'react-icons/hi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Select } from 'antd';
import { cn } from '@/lib/utils';
import { useToast } from '@/lib/toast-context';

const roleOptions = [
  {
    value: 'finance_officer',
    label: 'Finance Officer',
    icon: HiOutlineCurrencyDollar,
  },
  {
    value: 'church_admin',
    label: 'Church Admin',
    icon: HiOutlineCog,
  },
  {
    value: 'head_pastor',
    label: 'Head Pastor',
    icon: HiOutlineUser,
  },
];

const demoCredentials = {
  finance_officer: { email: 'finance@church.com', password: 'finance123' },
  church_admin: { email: 'admin@church.com', password: 'admin123' },
  head_pastor: { email: 'pastor@church.com', password: 'pastor123' },
};

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('church_admin');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();

  const handleRoleSelect = (selectedRole: UserRole) => {
    setRole(selectedRole);
    const creds = demoCredentials[selectedRole];
    setEmail(creds.email);
    setPassword(creds.password);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const success = await login(email, password, role);
      if (success) {
        showToast('Sign in successful!', 'success');
        router.push('/dashboard');
      } else {
        showToast('Invalid email, password, or role. Please try again.', 'error');
      }
    } catch (error) {
      showToast('An error occurred. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 sm:p-6">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 mb-3 sm:mb-4">
            <img 
              src="/images/logos/logo.png" 
              alt="Church Logo" 
              className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
            />
          </div>
          <p className="text-sm sm:text-base text-gray-600">Sign in to continue</p>
        </div>

        {/* Login Card */}
        <Card className="shadow-lg border-gray-200">
          <CardContent className="p-5 sm:p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Role Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>
                <Select
                  value={role}
                  onChange={(value) => handleRoleSelect(value as UserRole)}
                  size="large"
                  className="w-full"
                  options={roleOptions.map((opt) => {
                    const Icon = opt.icon;
                    return {
                      value: opt.value,
                      label: (
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4 text-gray-500" />
                          <span>{opt.label}</span>
                        </div>
                      ),
                    };
                  })}
                />
              </div>

              {/* Email Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <HiOutlineMail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10 h-11"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <HiOutlineLockClosed className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-10 pr-16 h-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500 hover:text-gray-700 font-medium"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-11 font-medium"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Signing in...
                  </span>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
              <p className="text-xs font-medium text-gray-500 mb-2 sm:mb-3">Demo Credentials:</p>
              <div className="space-y-2">
                {roleOptions.map((option) => {
                  const creds = demoCredentials[option.value as UserRole];
                  const Icon = option.icon;
                  const isSelected = role === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleRoleSelect(option.value as UserRole)}
                      className={cn(
                        'w-full text-left p-2.5 sm:p-3 rounded-lg border transition-all',
                        isSelected
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      )}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4 text-gray-500 flex-shrink-0" />
                          <span className="text-xs sm:text-sm font-medium text-gray-900">{option.label}</span>
                        </div>
                        {isSelected && (
                          <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                        )}
                      </div>
                      <div className="text-xs text-gray-600 font-mono mt-1 break-all">
                        {creds.email} / {creds.password}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-6">
          © 2025 Church Management System. All rights reserved.
        </p>
      </div>
    </div>
  );
}
