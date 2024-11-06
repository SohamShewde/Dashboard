import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy:{
      '/users':'http://localhost:5000',
      '/users/total':'http://localhost:5000',
      //  '/sales':'http://localhost:5000',
      '/sales/week' : 'http://localhost:5000',
      '/sales/last-week' : 'http://localhost:5000',
      '/sales/month' : 'http://localhost:5000',
      '/sales/last-month' : 'http://localhost:5000',
      '/sales/year' : 'http://localhost:5000',
      '/sales/last-year' : 'http://localhost:5000',
      '/sales/custom-range' : 'http://localhost:5000',
      '/sales/monthly-total' : 'http://localhost:5000',
      '/sales/spc-data/:parameterId' : 'http://localhost:5000',
      '/sales/spc-data' : 'http://localhost:5000',
      '/sales/parameters' : 'http://localhost:5000',
      // '/invoices/create' : 'http://localhost:5000',
      // '/invoices/read' : 'http://localhost:5000',
      // '/invoices/update/:id' : 'http://localhost:5000',
      // '/invoices/delete/:id' : 'http://localhost:5000'
    }
  },
  plugins: [react()],
})
