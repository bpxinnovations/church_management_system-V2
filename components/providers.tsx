'use client';

import '@ant-design/v5-patch-for-react-19';
import { ConfigProvider } from 'antd';
import { MantineProvider } from '@mantine/core';
import { AuthProvider } from '@/lib/auth-context';
import { ToastProvider } from '@/lib/toast-context';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MantineProvider>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#015595',
          },
          components: {
            Tag: {
              colorSuccess: '#015595',
            },
          },
        }}
      >
        <AuthProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </AuthProvider>
      </ConfigProvider>
    </MantineProvider>
  );
}

