const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function seedInvoices() {
  const invoices = Array.from({ length: 50 }, (_, i) => {
    const amount = Math.floor(Math.random() * 5000) + 100
    const tax = amount * 0.1
    const total = amount + tax
    const status = ['draft', 'sent', 'paid', 'overdue', 'cancelled'][Math.floor(Math.random() * 5)]
    
    return {
      invoice_id: `INV-${1000 + i}`,
      customer_name: `Customer ${i + 1}`,
      customer_email: `customer${i + 1}@example.com`,
      invoice_date: new Date(Date.now() - Math.random() * 10000000000).toISOString().split('T')[0],
      due_date: new Date(Date.now() + Math.random() * 10000000000).toISOString().split('T')[0],
      amount,
      tax: 10,
      total,
      status,
      payment_method: ['Credit Card', 'Bank Transfer', 'PayPal', null][Math.floor(Math.random() * 4)],
      notes: 'Test invoice'
    }
  })

  const { error } = await supabase.from('invoices').insert(invoices)
  if (error) console.error('Error seeding invoices:', error)
  else console.log('Successfully seeded 50 invoices')
}

async function seedOrders() {
  const orders = Array.from({ length: 50 }, (_, i) => {
    const subtotal = Math.floor(Math.random() * 1000) + 50
    const shipping = 10
    const discount = Math.random() > 0.7 ? 10 : 0
    const total = subtotal + shipping - (subtotal * discount / 100)
    const status = ['pending', 'confirmed', 'processing', 'delivered'][Math.floor(Math.random() * 4)]

    return {
      order_id: `ORD-${5000 + i}`,
      customer_name: `Customer ${i + 1}`,
      customer_phone: `+1-555-010${i}`,
      order_date: new Date(Date.now() - Math.random() * 10000000000).toISOString().split('T')[0],
      shipping_address: `${100 + i} Main St, Springfield`,
      items_count: Math.floor(Math.random() * 10) + 1,
      subtotal,
      shipping_cost: shipping,
      discount,
      total,
      status,
      tracking_number: status === 'delivered' ? `TRK${123456 + i}` : null,
      estimated_delivery: new Date(Date.now() + Math.random() * 10000000000).toISOString().split('T')[0]
    }
  })

  const { error } = await supabase.from('orders').insert(orders)
  if (error) console.error('Error seeding orders:', error)
  else console.log('Successfully seeded 50 orders')
}

async function run() {
  await seedInvoices()
  await seedOrders()
}

run()
