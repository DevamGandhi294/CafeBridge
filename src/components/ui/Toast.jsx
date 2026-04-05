import { Toaster } from 'react-hot-toast';

export default function Toast() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 2500,
        style: {
          background: '#fff',
          color: '#3e1d08',
          fontFamily: '"DM Sans", system-ui, sans-serif',
          fontSize: '14px',
          fontWeight: '500',
          padding: '12px 16px',
          borderRadius: '14px',
          boxShadow: '0 8px 24px rgba(101,60,20,0.18)',
          border: '1px solid rgba(217,169,106,0.3)',
          maxWidth: '320px',
        },
        success: {
          iconTheme: {
            primary: '#9a5318',
            secondary: '#fdf9ee',
          },
        },
        error: {
          iconTheme: {
            primary: '#dc2626',
            secondary: '#fef2f2',
          },
        },
      }}
    />
  );
}
