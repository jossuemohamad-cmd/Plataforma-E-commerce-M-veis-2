import React, { useEffect, useState } from 'react';
import { ShowroomLocation, ActiveScreen } from '../types';
import { SHOWROOMS } from '../data/aethelData';
import { createQuoteRequest, listShowrooms } from '../services/catalogService';

interface ShowroomsScreenProps {
  onNavigate: (screen: ActiveScreen) => void;
}

export const ShowroomsScreen: React.FC<ShowroomsScreenProps> = ({ onNavigate }) => {
  const [selectedShowroom, setSelectedShowroom] = useState<ShowroomLocation>(SHOWROOMS[0]);
  const [showrooms, setShowrooms] = useState<ShowroomLocation[]>(SHOWROOMS);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [purpose, setPurpose] = useState('especificacao');
  const [booked, setBooked] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    void listShowrooms().then((items) => {
      setShowrooms(items);
      if (items[0]) setSelectedShowroom(items[0]);
    }).catch((error) => setBookingError(error instanceof Error ? error.message : 'Falha ao carregar sucursais.'));
  }, []);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setBookingError(null);
    try {
      await createQuoteRequest({ showroomId: selectedShowroom.id, name, email, phone, desiredDate: date, purpose });
      setBooked(true);
    } catch (error) {
      setBookingError(error instanceof Error ? error.message : 'Não foi possível agendar a visita.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-[#faf9f7] pt-8 pb-20">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 font-['Plus_Jakarta_Sans'] text-xs text-[#7c766f] mb-6">
          <button onClick={() => onNavigate('home')} className="hover:text-black transition-colors">
            Início
          </button>
          <span>/</span>
          <span className="text-[#1a1c1b] font-medium">Sucursais</span>
        </nav>

        {/* Header */}
        <div className="mb-12 pb-8 border-b border-[#e9e8e6]">
          <span className="font-['Plus_Jakarta_Sans'] text-[11px] font-semibold uppercase text-[#7d5540] tracking-[0.16em] block mb-1">
            Rede Eden em Moçambique
          </span>
          <h1 className="font-['Playfair_Display'] text-3xl sm:text-4xl lg:text-5xl text-[#1a1c1b] font-normal tracking-tight">
            Sucursais e unidades Eden
          </h1>
          <p className="font-['Plus_Jakarta_Sans'] text-sm sm:text-base text-[#4a4640] mt-2 max-w-3xl leading-relaxed">
            Encontre as unidades oficiais publicadas pela Espuma de Moçambique em Matola, Beira e Nampula. Confirme sempre o horário antes da visita.
          </p>
        </div>

        {/* 3 Grandes Galerias */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {showrooms.map((s) => (
            <div
              key={s.id}
              className="bg-white border border-[#e9e8e6] shadow-xs flex flex-col justify-between overflow-hidden group hover:shadow-md transition-shadow"
            >
              <div>
                {/* Imagem do Showroom */}
                <div className="relative aspect-[16/10] overflow-hidden bg-[#efeeec]">
                  <img
                    src={s.image}
                    alt={s.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 bg-black/80 backdrop-blur-sm text-white font-['Plus_Jakarta_Sans'] text-[10px] uppercase font-bold tracking-wider">
                    {s.city}
                  </div>
                </div>

                {/* Conteúdo textual */}
                <div className="p-6">
                  <span className="font-['Plus_Jakarta_Sans'] text-[10px] uppercase font-semibold text-[#7d5540] tracking-widest block mb-1">
                    {s.title}
                  </span>
                  <h3 className="font-['Playfair_Display'] text-xl text-[#1a1c1b] font-normal leading-snug mb-3">
                    {s.name}
                  </h3>

                  <div className="space-y-2.5 font-['Plus_Jakarta_Sans'] text-xs text-[#4a4640]">
                    <div className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-[16px] text-[#7d5540] shrink-0 mt-0.5">
                        location_on
                      </span>
                      <span>{s.address}</span>
                    </div>

                    <div className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-[16px] text-[#7d5540] shrink-0 mt-0.5">
                        schedule
                      </span>
                      <span>{s.hours}</span>
                    </div>

                    <div className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-[16px] text-[#7d5540] shrink-0 mt-0.5">
                        call
                      </span>
                      <span>{s.phone}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-[#f4f3f1] font-['Plus_Jakarta_Sans'] text-xs text-[#7c766f]">
                    <span className="font-semibold text-[#1a1c1b] block mb-1">Informação da unidade:</span>
                    <p className="leading-relaxed">{s.description}</p>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0">
                <button
                  onClick={() => {
                    setSelectedShowroom(s);
                    const el = document.getElementById('agendamento-form');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full py-3 bg-[#f4f3f1] hover:bg-black hover:text-white text-[#1a1c1b] font-['Plus_Jakarta_Sans'] text-[11px] uppercase font-semibold tracking-wider transition-colors text-center"
                >
                  Solicitar contacto
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ==========================================
            FORMULÁRIO DE AGENDAMENTO PRIVADO
            ========================================== */}
        <div id="agendamento-form" className="bg-[#f4f3f1] p-8 sm:p-12 border border-[#e9e8e6]">
          <div className="max-w-3xl mb-8">
            <span className="font-['Plus_Jakarta_Sans'] text-[11px] font-semibold uppercase text-[#7d5540] tracking-[0.16em] block mb-1">
              Atendimento Dedicado
            </span>
            <h2 className="font-['Playfair_Display'] text-2xl sm:text-3xl text-[#1a1c1b] font-normal">
              Solicitar Experiência Privada no Espaço
            </h2>
            <p className="font-['Plus_Jakarta_Sans'] text-xs sm:text-sm text-[#4a4640] mt-1">
              Receba um acolhimento exclusivo com degustação de cafés especiais, apresentação da matérioteca completa e consultoria direta com os nossos arquitetos residentes.
            </p>
          </div>

          {booked ? (
            <div className="p-6 bg-white border border-[#e9e8e6] text-center max-w-xl mx-auto space-y-3">
              <span className="material-symbols-outlined text-4xl text-[#7d5540]">verified</span>
              <h3 className="font-['Playfair_Display'] text-xl text-[#1a1c1b]">Visita Solicitada com Sucesso</h3>
              <p className="font-['Plus_Jakarta_Sans'] text-xs text-[#4a4640]">
                O nosso Concierge entrará em contacto para confirmar a disponibilidade no espaço <strong>{selectedShowroom.name}</strong> para o dia <strong>{date}</strong>.
              </p>
              <button
                onClick={() => setBooked(false)}
                className="mt-2 px-6 py-2.5 bg-black text-white text-xs uppercase tracking-wider font-semibold"
              >
                Fazer Novo Agendamento
              </button>
            </div>
          ) : (
            <form onSubmit={handleBooking} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 font-['Plus_Jakarta_Sans'] text-xs">
              <div>
                <label className="block text-[#7c766f] uppercase tracking-wider font-semibold text-[10px] mb-1">
                  Nome Completo
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome"
                  className="w-full bg-white px-3.5 py-2.5 text-[#1a1c1b] border border-[#cdc5bd] focus:border-black focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#7c766f] uppercase tracking-wider font-semibold text-[10px] mb-1">
                  Correio Eletrónico
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@dominio.com"
                  className="w-full bg-white px-3.5 py-2.5 text-[#1a1c1b] border border-[#cdc5bd] focus:border-black focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#7c766f] uppercase tracking-wider font-semibold text-[10px] mb-1">
                  Telemóvel / WhatsApp
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+258 84 000 0000"
                  className="w-full bg-white px-3.5 py-2.5 text-[#1a1c1b] border border-[#cdc5bd] focus:border-black focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#7c766f] uppercase tracking-wider font-semibold text-[10px] mb-1">
                  Espaço Selecionado
                </label>
                <select
                  value={selectedShowroom.id}
                  onChange={(e) => {
                    const found = SHOWROOMS.find((s) => s.id === e.target.value);
                    if (found) setSelectedShowroom(found);
                  }}
                  className="w-full bg-white px-3.5 py-2.5 text-[#1a1c1b] border border-[#cdc5bd] focus:border-black focus:outline-none cursor-pointer"
                >
                  {SHOWROOMS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.city} • {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[#7c766f] uppercase tracking-wider font-semibold text-[10px] mb-1">
                  Data Pretendida
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  min={new Date().toISOString().slice(0, 10)}
                  className="w-full bg-white px-3.5 py-2.5 text-[#1a1c1b] border border-[#cdc5bd] focus:border-black focus:outline-none cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-[#7c766f] uppercase tracking-wider font-semibold text-[10px] mb-1">
                  Finalidade da Visita
                </label>
                <select
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="w-full bg-white px-3.5 py-2.5 text-[#1a1c1b] border border-[#cdc5bd] focus:border-black focus:outline-none cursor-pointer"
                >
                  <option value="especificacao">Especificação Arquitetural / B2B</option>
                  <option value="residencial">Projeto Residencial Pessoal</option>
                  <option value="hotelaria">Hotelaria, Resort ou Restaurante</option>
                </select>
              </div>

              <div className="sm:col-span-2 lg:col-span-3 pt-2">
                {bookingError && <p role="alert" className="mb-3 border border-red-200 bg-red-50 p-3 text-xs text-red-800">{bookingError}</p>}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto px-8 py-3.5 bg-black text-white hover:bg-[#7d5540] font-['Plus_Jakarta_Sans'] text-[11px] uppercase font-semibold tracking-wider transition-colors shadow-sm"
                >
                  {submitting ? 'A confirmar…' : 'Confirmar Agendamento com o Concierge'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
