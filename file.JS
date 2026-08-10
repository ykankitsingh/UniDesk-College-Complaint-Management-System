// ==========================================
// UNIDESK CONSOLIDATED BLUEPRINT (ALL-IN-ONE)
// ==========================================

import React, { useState } from 'react';

// --- 1. FRONTEND: MOCK DASHBOARD COMPONENT ---
export default function UniDeskApp() {
  const [tickets, setTickets] = useState([
    { id: '1', title: 'Hostel Wi-Fi Down', category: 'Facilities', status: 'PENDING' },
    { id: '2', title: 'Grade Discrepancy in CS101', category: 'Academics', status: 'IN_PROGRESS' },
  ]);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Facilities');

  const handleCreateTicket = (e) => {
    e.preventDefault();
    if (!title) return;
    const newTicket = { id: Date.now().toString(), title, category, status: 'PENDING' };
    setTickets([newTicket, ...tickets]);
    setTitle('');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto font-sans bg-slate-50 min-h-screen">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900">UniDesk Dashboard</h1>
        <p className="text-slate-600">Grievance Redressal Portal</p>
      </header>

      {/* Ticket Submission Form */}
      <form onSubmit={handleCreateTicket} className="bg-white p-4 rounded-xl shadow-sm mb-6 flex gap-4">
        <input 
          type="text" 
          placeholder="Brief issue title..." 
          value={title} 
          onChange={(e) => setTitle(e.target.value)}
          className="flex-1 border p-2 rounded-lg text-sm"
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="border p-2 rounded-lg text-sm">
          <option>Facilities</option>
          <option>Academics</option>
          <option>Administration</option>
        </select>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
          Submit Ticket
        </button>
      </form>

      {/* Ticket List */}
      <div className="grid gap-4">
        {tickets.map(ticket => (
          <div key={ticket.id} className="bg-white p-4 rounded-xl shadow-sm flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-slate-800">{ticket.title}</h3>
              <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{ticket.category}</span>
            </div>
            <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${
              ticket.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'
            }`}>
              {ticket.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* 
// ==========================================
// 2. BACKEND EQUIVALENT (NestJS / Prisma Concept)
// ==========================================
// Run inside your NestJS backend service:

import { Injectable } from '@nestjs/common';

@Injectable()
export class TicketControllerSimulator {
  // Prisma Schema representation:
  // model Ticket { id String @id @default(uuid()), title String, category String, status String }

  async create(data: { title: string; category: string }) {
    return { id: Math.random().toString(), ...data, status: 'PENDING', createdAt: new Date() };
  }
}
*/
