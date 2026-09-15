import React from 'react';
import { ActiveScreen } from '../types';

interface EdenInfoScreenProps {
  mode: 'sobre' | 'colecoes' | 'contacto';
  onNavigate: (screen: ActiveScreen) => void;
}

const foamLines = [
  { code: 'SP10', density: '11', level: 'Espuma leve' },
  { code: 'SP20', density: '15', level: 'Espuma média-leve' },
  { code: 'SP30', density: '17,5', level: 'Espuma medicinal de qualidade média' },
  { code: 'SP40', density: '22', level: 'Espuma medicinal de alta qualidade' },
  { code: 'SP60', density: '30', level: 'Espuma ortopédica de alta densidade' }
];

const branches = [
  ['Matola', 'Av. Samora Machel, Bairro Tchumene'],
  ['Beira', 'Estrada Nacional Nr. 6, Bairro Vaz'],
  ['Nampula', 'Estrada Nacional Nr. 8, Mutava Rex']
];

export const EdenInfoScreen: React.FC<EdenInfoScreenProps> = ({ mode, onNavigate }) => {
  if (mode === 'sobre') {
    return (
      <section className="bg-white text-[#132240]">
        <div className="eden-dark-surface bg-[#132240] text-white">
          <div className="mx-auto grid max-w-[1400px] gap-10 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[1.15fr_.85fr] lg:px-12">
            <div>
              <p className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-[#FDCB00]">Sobre a Eden</p>
              <h1 className="max-w-3xl font-['Playfair_Display'] text-4xl leading-tight sm:text-6xl">
                Mais do que uma marca, a escolha para um sono saudável.
              </h1>
            </div>
            <div className="border-l-4 border-[#FDCB00] pl-6 text-base leading-8 text-white/85">
              <p>A Eden® Colchões e Mobília é uma marca registada da Espuma de Moçambique, Lda.</p>
              <p className="mt-4">A marca nasceu com foco na personalização, criando soluções adaptadas às necessidades e preferências de cada cliente.</p>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-[1400px] px-5 py-14 sm:px-8 lg:px-12">
          <div className="grid gap-5 md:grid-cols-3">
            {[
              ['Valor justo', 'Produtos de qualidade a preços justos, com valor real para cada cliente.'],
              ['Feito para durar', 'Fabrico com maquinaria moderna, técnicas de produção e experiência especializada.'],
              ['Feito para si', 'Produtos desenvolvidos em torno das necessidades únicas de cada pessoa.']
            ].map(([title, copy], index) => (
              <article key={title} className="border border-[#dbe8f0] bg-[#f5faff] p-7">
                <span className="mb-5 flex h-10 w-10 items-center justify-center bg-[#FDCB00] font-bold text-[#132240]">0{index + 1}</span>
                <h2 className="text-xl font-bold text-[#005EA4]">{title}</h2>
                <p className="mt-3 text-base leading-7 text-[#2D3E50]">{copy}</p>
              </article>
            ))}
          </div>

          <div className="mt-12 grid gap-8 border border-[#dbe8f0] border-t-4 border-t-[#FDCB00] bg-white p-8 text-[#132240] lg:grid-cols-2 lg:p-12">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#132240]">O nosso caminho</p>
              <h2 className="mt-3 font-['Playfair_Display'] text-3xl">Soluções completas para a casa</h2>
            </div>
            <ul className="space-y-4 text-base leading-7 text-[#2D3E50]">
              <li>Expansão para além de espuma e colchões, com soluções completas de mobiliário.</li>
              <li>Maior presença nas cidades de todas as províncias de Moçambique.</li>
              <li>Valorização e desenvolvimento de profissionais moçambicanos.</li>
            </ul>
          </div>
        </div>
      </section>
    );
  }

  if (mode === 'colecoes') {
    return (
      <section className="bg-[#f5faff] px-5 py-14 text-[#132240] sm:px-8 sm:py-20 lg:px-12">
        <div className="mx-auto max-w-[1400px]">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#005EA4]">Coleções Eden</p>
          <div className="mt-3 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <h1 className="max-w-3xl font-['Playfair_Display'] text-4xl sm:text-5xl">Conforto para dormir, viver e mobilar.</h1>
            <button onClick={() => onNavigate('catalogo')} className="w-fit bg-[#FDCB00] px-6 py-3 text-sm font-bold uppercase tracking-wider text-[#132240] hover:bg-[#ffd83d]">
              Comprar na loja
            </button>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {['Colchões', 'Bases de cama', 'Sofás', 'Almofadas', 'Decoração', 'Espumas'].map((item) => (
              <button key={item} onClick={() => onNavigate('catalogo')} className="group flex min-h-32 items-end justify-between bg-[#f4f3f1] p-6 text-left text-black transition hover:bg-[#e9e8e6]">
                <span className="text-xl font-bold text-black">{item}</span>
                <span className="material-symbols-outlined text-black transition-transform group-hover:translate-x-1">arrow_forward</span>
              </button>
            ))}
          </div>

          <div className="mt-16">
            <div className="max-w-3xl">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#005EA4]">Guia oficial de espumas</p>
              <h2 className="mt-2 font-['Playfair_Display'] text-3xl sm:text-4xl">Densidades para diferentes níveis de suporte</h2>
              <p className="mt-3 text-base leading-7 text-[#2D3E50]">Conheça as linhas publicadas pela Espuma de Moçambique. A escolha final deve considerar o uso e a orientação da equipa Eden.</p>
            </div>
            <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {foamLines.map((foam) => (
                <article key={foam.code} className="border-t-4 border-[#FDCB00] bg-white p-5 shadow-sm">
                  <p className="text-2xl font-black text-[#005EA4]">{foam.code}</p>
                  <p className="mt-5 text-sm font-bold uppercase tracking-wider text-[#132240]">Densidade {foam.density}</p>
                  <p className="mt-2 text-sm leading-6 text-[#2D3E50]">{foam.level}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white px-5 py-14 text-[#132240] sm:px-8 sm:py-20 lg:px-12">
      <div className="mx-auto max-w-[1400px]">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#005EA4]">Contacto</p>
        <h1 className="mt-3 max-w-3xl font-['Playfair_Display'] text-4xl sm:text-5xl">Fale com a equipa Eden.</h1>
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="eden-card eden-dark-surface bg-[#132240] p-7 text-white sm:p-9">
            <h2 className="text-xl font-bold text-[#FDCB00]">Vendas a retalho</h2>
            <a href="tel:+258870003388" className="mt-5 block text-2xl font-bold hover:text-[#FDCB00]">+258 87 000 3388</a>
            <a href="mailto:esales@esm.co.mz" className="mt-2 block text-base text-white/80 hover:text-white">esales@esm.co.mz</a>
            <div className="my-8 h-px bg-white/15" />
            <h2 className="text-xl font-bold text-[#FDCB00]">Vendas a grosso</h2>
            <a href="tel:+258841110444" className="mt-5 block text-2xl font-bold hover:text-[#FDCB00]">+258 84 111 0444</a>
            <a href="mailto:customers@esm.co.mz" className="mt-2 block text-base text-white/80 hover:text-white">customers@esm.co.mz</a>
          </div>
          <div className="eden-card border border-[#dbe8f0] bg-[#f5faff] p-7 sm:p-9">
            <h2 className="text-xl font-bold text-[#005EA4]">Presença em Moçambique</h2>
            <div className="mt-5 space-y-5">
              {branches.map(([city, address]) => (
                <div key={city} className="border-b border-[#dbe8f0] pb-5 last:border-0 last:pb-0">
                  <p className="font-bold">{city}</p>
                  <p className="mt-1 text-base leading-6 text-[#2D3E50]">{address}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
