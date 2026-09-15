import { Product, Order, ShowroomLocation } from '../types';

export const AETHEL_PRODUCTS: Product[] = [
  {
    id: 'sof-nuvola',
    sku: 'SOF-NUV-001',
    title: 'Sofá Modular Nuvola em Linho Cru',
    category: 'Sofás & Chaise',
    ambiente: 'Sala de Estar',
    price: 79900,
    originalPrice: 89500,
    rating: 4.9,
    reviewCount: 28,
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDFOUwpV0mFZOagYu4ikogGi21LreIVRE_W2J41_3TlGZGwWngCs5ZoVlsf3X8Ei938ut5llACSYSdoKBE0WIU1gqQQm--HXIQr5RMXRLnduFxsXfOO0QcKr3q6aio3-w1xYocgLp2jv6_A5DwX8WyfPGWDZv_RYyI4q__AQsy7Q-qW6NzsmUPFvNM-JCyrNl2lFFztzzbfBxpQ8kv3NDlrQAyQXf5H9bVsPAl_9Ny1JadRKnJXUdwmIA',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDuNlpJfhlovlhh_987fbxvXZMJiQlYfUMlMTXHuKjEa6Y-TDLePBr8SRofZA2ydWS2YV64wsugGsFKixZJcsPdB1Y5erj2uhJawryMJt213XlcqPRgpONMMPUmNWP4LgsH5C5utXodjt2FEmpre82iV4zv6RuQ82QUxagPjPXE5UVf_BjEgR0L1xA1m7BtX4c2KpzxFkNFsLJNzS5_zV-Ac9V-qkvY86_ix-u4JsDd-gPPwqqO768xKA',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDdWuGkeV9UIbstqU2wv4RiPtTih1F9MKYLcFLHM2otKwNwADip2sPokGoGi4e4b3Lebd7hr-i265If_PNODOmyMJovjARAc4a0ajyZMoOu66tttwljzuivmYtcfLgkHYy0i08PhJnlKnEywXfjL7lIM0TTa6koCSn4-rNKzVUQgEHMR3vVJlRHCLHo9q2vUMOYRPz8uHHmIsjSYTMYzn8h1mbDOsqc89uBmCZxpaG-fqGwvd_TozJJ4A',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB7RT0xU1crYe9HGU3iEIxwXkOdwVZz6yrLTSTe6Sch2p0PNKH4vLZ-RiKqvEk-ct78pcZkAebNCb5fMyeL0XbvN5Gw4GeoEoRDYXOYiKu3euqzVhPK1_Q0g4zG06Q3uj0LMMu6xobnoYlEOGL6ZaWoRMbZpT7Na5EEkmiD2ZadGpkzxVOropfi4z0qc-q7vskbo3WonJxvwJANEYZmxgqXLU37EYS7nPFoFOpAiFoGdSD8E6fGIcCG1Q',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuANLuOEQ_Lds0I09Ss5N8Q-sdpdFXY_Gtk8Wo2WJpSeiDsFGaL5cpPcIG-fze84vtDfmsFqgHWl8AarujqV9tvWBgarypF8CHXbLArkQL4wT9vrvOyX58lOH6DRRaaRoWtB3fcDT0H_h5ze56Uw5bXqmAg8O9eoS9FSj9-yYhsns_-6PSs1a-D8cbvCRTpbzSP5SlXwPcNZ6JZkv6kUs0-rKDHrZ_Xagd0xn29yqCrsx81voATJIhwJuA'
    ],
    description: 'Conforto supremo com camadas de espuma D33 e fibra siliconada pluma revestidas em linho belga natural desestruturado. Estrutura em eucalipto tratado com juntas duplas cavilhadas para longevidade arquitetônica.',
    designer: 'Studio Aethel • Linha Pura',
    material: 'Linho Belga Cru • Eucalipto Reflorestado',
    badge: 'Lançamento Coleção 2025',
    inStock: true,
    stockCount: 8,
    featured: true,
    isNew: true,
    dimensions: {
      width: 280,
      height: 82,
      depth: 105,
      weight: 78.5
    },
    colorSwatches: [
      { name: 'Linho Cru', color: '#E3DAC9' },
      { name: 'Cinza Grafite', color: '#4A4B4D' },
      { name: 'Bouclé Off-White', color: '#F5F5F0' }
    ],
    materialOptions: [
      { name: 'Linho Natural Cru', color: '#E3DAC9', extraPrice: 0 },
      { name: 'Linho Cinza Grafite', color: '#4A4B4D', extraPrice: 3500 },
      { name: 'Bouclé Off-White Nobre', color: '#F5F5F0', extraPrice: 5000 }
    ],
    sizeOptions: [
      { label: '280 cm', subLabel: '3 Módulos • Padrão', extraPrice: 0 },
      { label: '340 cm', subLabel: '4 Módulos c/ Chaise', extraPrice: 12000 },
      { label: 'Personalizado', subLabel: 'Sob medida estúdio', extraPrice: 0, custom: true }
    ],
    specs: {
      'Largura Total': '280.00 cm',
      'Profundidade': '105.00 cm',
      'Altura Total': '82.00 cm',
      'Altura do Assento': '42.00 cm',
      'Densidade Espuma': 'Poliuretano D33 + Pluma Siliconada',
      'Estrutura Interna': 'Eucalipto tratado em estufa (<12% umidade)',
      'Garantia': '24 meses com certificado de lote'
    }
  },
  {
    id: 'pol-kyoto',
    sku: 'POL-KYO-002',
    title: 'Poltrona Kyoto',
    category: 'Cadeiras & Poltronas',
    ambiente: 'Sala de Estar',
    price: 38400,
    originalPrice: undefined,
    rating: 4.8,
    reviewCount: 19,
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC5AflP88jMBe1n-uh9m2tgHQ1zP2iI7i0mfvBhlfm03grETIsOt-YJsz34CQE2O4-7Eqv0ErUbVlB28x6zHL5LU0Xivu7pjV1W-OgmpiR6sugNu9xGnZJEN2qduR3ZLWgNC2aRxI0b8PyH5N2voH__jIps1prfrIaxlNRdYy9CEPFvvEKQCK-BQpndrJ2MNxR2oI_H2u__x0QVgSN7BwHY171xC33ymKPrucIJIT4tUo0rw3hUn1QTsQ',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCLHdGy1p1FnfPls0IiTm_nqxMxuZZDkcKzCKfIWUiwm0YthGyBiXM2L8pVmnmjPsn3YWb_jfufOZSdwrFT2zw4VYvw38_hkDY9J5k7OZJUJclkH6uuwR6ZyAV6j1ECy04oZLQihejivdqmR1GQFmKFYn4Xg_qubDg-n7HxNQ7HQNI5HPT_wdmrWAPN1nQcMZ0-TYEGhP8b25mSEqIFzBb6Tf0VyuH3vMr_gjVFobKCUlBHYfKnZTuaKQ',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCUwISSiIYocECG8MGQRvXoLV8kGxp3LhuyjgALvNeXe11d_91KSMcVhban5-n4M6YGeY05GIecbRIjF1YlRsjG46tvwkvHrtIXtnAlIc-kJRnAn6j_yGYfWw79Wm0KeQHNoU2PZ5Qb2Dz5ubH4rElideKAvboBefknYPpAtN80N5LT_ZR2Gqt9ZTatIS6cvaXSxx6Q725ya7crGOQC5kn5lwGoFtABEutBd4dj3JzzbzMEMdZi8eIwDQ'
    ],
    description: 'Poltrona de design assinado em carvalho maciço e estofamento em Bouclé Italiano com toque tátil aconchegante. Encaixes tradicionais de marcenaria japonesa adaptados ao clima contemporâneo.',
    designer: 'Studio Kengo',
    material: 'Carvalho Maciço Fumê • Bouclé Marfim',
    badge: 'Novo Ingresso',
    inStock: true,
    stockCount: 15,
    featured: true,
    isNew: true,
    dimensions: {
      width: 88,
      height: 70,
      depth: 82,
      weight: 22
    },
    colorSwatches: [
      { name: 'Off-White', color: '#EDECE8' },
      { name: 'Terracota', color: '#B26A4D' }
    ],
    specs: {
      'Estrutura': 'Carvalho maciço certificado FSC',
      'Revestimento': 'Bouclé Italiano 480g/m²',
      'Dimensões': '88 x 82 x 70 cm',
      'Garantia': '36 meses'
    }
  },
  {
    id: 'mes-nogueira-real',
    sku: 'MES-NOG-005',
    title: 'Mesa de Jantar Nogueira Real',
    category: 'Mesas de Jantar & Centro',
    ambiente: 'Sala de Jantar',
    price: 68900,
    originalPrice: 76500,
    rating: 5.0,
    reviewCount: 12,
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBOWeyV90QQaF4TzgZ8a_TYCXubvKGNZRZiJJuuMBDR2Tcnx4Y3woVemYd2-A6Q7EagxagsCaa8XmyfNnqCmQPnbb1CyGSIKKHhqgPJL0YpV-8X9P1-i2MtUIGfSgZITl88qVFt0Fu7rzfiP2X_C5sEBsFuA4itf4wWSAqOFSxX1DcJSyAecrPpTu-fHucA2-hDyTMz_YXeQwN-rflBgTeCRfEI4Bpu4x81M5fF02Lh0so4t_lzKXKcGQ',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA9lnR1VMQMnw1P9sFqpqI9GS6BKjyxuyiWZy9HwBnbYt6HLWzFCtXTwOimwTZiCcKrxAb9AIqjUuYnAacEEKHA0hDQ9ANyhYe1DabL9tZw2f8oD2J0eoMGUPnwKvU0ArjlhCRff5IHzAX4n4lWrDafs8dXl97sYiAGGmf4KzeOdb6KJsoKNwJP1f8TQLbZEGz5GqnFPM0Wmqef_f2ilnjPP-04W8n6gmYOC0t1xNuG2G0vGAb2R2ICdQ',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCErLuOkj3lXwLhW_Ad05_V_Jx9FmnL0AGI_6fEJPMgadD9z_3UNEwl2o4FpScGQ8i8u9KWt0CWE1pNW2HuswyN_xO4U5Qtl3f07AsUJYnqRlfDMA2G3kyQAoxPMZlttpO2FurT08GBwxpJqm9O3jV7j_dgzXkHOqtAqQL7b_oLKcDiMW9-QcMKZSwqe-_oEs5hup2RWePQgkeAk-XzIQu44wMAbh8RffiJnxZYhadqRsPhsugwjDuICg'
    ],
    description: 'Tampo contínuo monolítico em nogueira maciça com bordas chanfradas e pernas cônicas esculturais. Capacidade ergonômica ampla para 8 a 10 assentos em banquetes sofisticados.',
    designer: 'Atelier Aethel',
    material: 'Nogueira Maciça Canaletto Oiled',
    badge: 'Sob Encomenda',
    inStock: true,
    stockCount: 4,
    featured: true,
    dimensions: {
      width: 280,
      height: 76,
      depth: 110,
      weight: 115
    },
    colorSwatches: [
      { name: 'Nogueira Escura', color: '#5A3825' }
    ],
    specs: {
      'Capacidade': '8 a 10 lugares',
      'Dimensões': '280 x 110 x 76 cm',
      'Espessura Tampo': '4.5 cm maciço',
      'Acabamento': 'Óleos naturais atóxicos sem solventes'
    }
  },
  {
    id: 'cam-sereno',
    sku: 'CAM-SER-008',
    title: 'Cama King Size Sereno',
    category: 'Camas & Cabeceiras',
    ambiente: 'Quarto',
    price: 84500,
    originalPrice: 94000,
    rating: 4.9,
    reviewCount: 15,
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBAavmSa4sWYbzlsNEQVhKspQfO36zE6QKXXS5Y_F0wqlq3OZla9iHitOsVpufp4unSdFiM4ysT7TDs061WjwQ2vEk-5uQlF4xZ0HM9Kyk2ord5j1FIhGld102eHBDJ04sXEFURnqC0RrgMkXw9DLLIH3d5rMei2SqFjZRgI_YGefzqCO9sWuR5w106iarE2uNUMoUaWM4pVdF6ZR_soR-EppCWSQ0o9EdgMqtXuKNBRmU0Ye5Wf0FDuA',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDYY1EPWqgEyM-tOrTiWsZzvblNiJIEaitrCrMKvbLz74oLHhlgV8dasPo8nej_biF7p-FMRwMo5NsvFtriL92TOH1-UhPMDAyP7Rds14DRTdueCZEECkTQjRoOyKkJgE5060L-p5IYGgzy1y-n9eJArO4qXWLbu8QVnowOi6x_ZDNSXmd82GU832d0qjwNCBHGd5LOIZoyk1-Un9f03NVd6O9XSQhHa3xCVf3m7SSZQem5bgy53UZSNQ',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCxQk2Ml-dKRVh4kmQPbgBuMb4pKHOlhz4OI2u5XfJOo61ciyAalfsK3T20q3Z5pohdLCngV_x-fOP2IomqHqjSE1kFJfvsYzmxxTG6i4XkvWBuNMPjUmqX0CTmz-K3vyWGe70Dlwfw3a-3XRApqa17QHAj60h61NyZPGdFtIcDxxI8jK1nWp4wqxMICUj6xgZcIEplMHklX7zE_g1JdjwVKkOJYEdX4-wzkq647QwFV1Z0zrupC4P0VA'
    ],
    description: 'Cabeceira estofada envolvente em tecido linho bouclé com base rebaixada com efeito flutuante arquitetural. Projetada para proporcionar silêncio acústico e conforto supremo.',
    designer: 'Atelier Aethel',
    material: 'Estrutura Suspensa Nogueira • Linho Cru Areia',
    badge: 'Suíte Master',
    inStock: true,
    stockCount: 3,
    featured: true,
    dimensions: {
      width: 220,
      height: 110,
      depth: 230,
      weight: 98
    },
    colorSwatches: [
      { name: 'Cinza Areia', color: '#DCD8D2' },
      { name: 'Grafite Nobre', color: '#524E48' }
    ],
    specs: {
      'Colchão Indicado': 'King Size (193 x 203 cm)',
      'Cabeceira': '220 cm de largura acústica',
      'Estrutura': 'Base flutuante em madeira nobre'
    }
  },
  {
    id: 'cad-brera',
    sku: 'CAD-BRE-006',
    title: 'Cadeira de Jantar Brera',
    category: 'Cadeiras & Poltronas',
    ambiente: 'Sala de Jantar',
    price: 14500,
    originalPrice: undefined,
    rating: 4.9,
    reviewCount: 34,
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAKyF7SOJhHnJjT39i0Tdym0EPhj6okIyCn3akzQGY2andKI4_x-BGjSalbgI29hqig9Qm6ibE62FikfLoZ_CNsXONJrhZN-geKtnhngN-rp8ZcpSer3NWRR4Vj5ME-20NZF9-yyFgHZI8hd11m0IFIYF6sATz9c7IbtRRI0FYp_YusfLqKjz3jv2PMm6fz46hENd1qJj4dX_fodcYYbciwEpmxFlTxVydWm8pmA57qq32Yy2XifC-tDw',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAhDfLz6g9kZvzxERi7CLaeI-oFls__Nz8etQhY-3-4emPpKTmC3zBZ99Z_RpEBnLztq_2Ve7GBmYjIsaPQhKff7estonvFbYdM2GCQGBRxdSfbWQUrcffTxmC3RKCYotwW0hF3Iq4tthCk9xaqk6zFk1hHSHzXfctjz41eLtONXiXwX97tK4BWEQZXZwXpRwik8eZ5G3r0HOBgMLKFgaG712S5pYODua6lKvwbSxXvDU0jGP8o9ZMEMQ',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDhSjXuWyufwHrYvbmfLchH7ZAbM2KM4YkZ1pl6L7kaO5m-eYIemCQ6kh1Ek4LLUyPim0Te-yWDC8TSCkzSLd747pWITJIGp75lXvF5HPHZ5PzaKTA4Tx-3duC6eVLM6OMjC8tE64A8ZNvd9kya-v4pXhg57RQMAMZptJ4YjoGVEfq7dN5SrLjLzxWOHnWzZDm2q1hiUPfhUttala03aHUTpQPfw8VsCxpTvO85KuqMp8FceEfpDfOIpw'
    ],
    description: 'Couro legítimo natural trabalhado à mão com costuras pespontadas e perfil esbelto em aço termolacado fosco. Ergonomia impecável para longas refeições de convívio.',
    designer: 'Edição Milão',
    material: 'Couro Bovino Aniline • Aço Carbono',
    inStock: true,
    stockCount: 32,
    featured: true,
    dimensions: {
      width: 54,
      height: 82,
      depth: 58,
      weight: 8.5
    },
    colorSwatches: [
      { name: 'Caramelo', color: '#9E5F33' },
      { name: 'Preto Ébano', color: '#1A1A1A' }
    ],
    specs: {
      'Estrutura': 'Tubo de aço curvado a frio',
      'Assento': 'Couro legítimo atanado 3.2mm',
      'Pack de 4': '54.000 MT (economia)'
    }
  },
  {
    id: 'mes-monolito',
    sku: 'MES-MON-003',
    title: 'Mesa de Centro Monolito',
    category: 'Mesas de Jantar & Centro',
    ambiente: 'Sala de Estar',
    price: 36500,
    originalPrice: 42000,
    rating: 4.8,
    reviewCount: 22,
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAToltq86cxvb6pvYHnKZmJvKEy0_N0XDm1AD-rC-nLKRPdF7nBYzNcryPEm85h2qAFnBRSEYgUxaxznj2Mb2AUe0qSx3xw9BLyJUr5_tCVsijcJMrcyTsSRDS_TT_mRfS2R3HGEbA1bIr5SWNPgLfMtVGCsCLVc-S8hVQYq1quyYexM3GF8HMChChBT3WZPZcxSojZZSypzEInEaywtAVWpHpIrjYpfrm3IIjFrtp7_3-LqpgjqC0Uag',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDLXku-ICvQbCR5GYG_ejUtX1RaFZO4MExanSlkmnYnzXzQf-zXFDbkWmuiqtpssyWoqZNBd5xENBgF-tLT3idIhW5BODWtC8czjVRFfyVB-7LZecvW61zT354NCJZukNiav1XomssS8nMd9KSv7BfliNBdUFCa6djDtx1YuBD9qckzI1vZIVHRW0Hw4_mYif724lOJOsFFspk-JTm38ashd5vUpHN_YwXYtkReuDdrh5C3oDMd7Qxbeg',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCL-Ct-ZkvkVJXpnpLWln_94k00-E7iN0sx6ipAop44gnVq4d19LhkwKbBlO_n21uTbjaAS4cQA4oZxfC66rO6ZypiuMVS99X4IDtn1TPw4NGt9kRcM4s-_0QcoRRTwUcmprmtmdRiwnKI4leG-_M_RyQY2-Q_ZDMWnPbxQoHHxzVwSCNIhPdR1IqKzmSiPK48Ps-b-EzumYKVagnqFIfbU62oW9Pi28oAWZC7lnCaBxjkpEH_5Izw-WA'
    ],
    description: 'Escultura monolítica lapidada em Mármore Travertino Navona fosco com cavidades minerais naturais seladas. Cada bloco possui veios e texturas geológicas inteiramente exclusivas.',
    designer: 'Atelier de Cantaria Aethel',
    material: 'Mármore Travertino Navona Acetinado',
    badge: 'Peça Única',
    inStock: true,
    stockCount: 5,
    featured: true,
    dimensions: {
      width: 140,
      height: 32,
      depth: 80,
      weight: 128
    },
    colorSwatches: [
      { name: 'Travertino Natural', color: '#D5C8B4' }
    ],
    specs: {
      'Origem da Pedra': 'Travertino Navona / Importação certificada',
      'Acabamento': 'Resinado acetinado hidrorrepelente',
      'Peso': '128 kg em bloco estruturado'
    }
  },
  {
    id: 'buf-origami',
    sku: 'BUF-ORI-007',
    title: 'Buffet & Aparador Origami Ripado',
    category: 'Estantes & Aparadores',
    ambiente: 'Sala de Estar',
    price: 47900,
    originalPrice: 52000,
    rating: 4.9,
    reviewCount: 11,
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBClIvy0YP_5iNUJRfndx9269_RqQlxHeyMx3zP-NrPb7EVC1FmaSvUeTiVqxpAU80fnRzGLUlcoPXinKVeWQuXFq2ryfDhjOGP81MTZ9MDvcn2wOc15Per5EEOqE8wmzt3hIQPXYiIHTmagGuVpPVJoJxk4Cs2zhAkilq6ZJ6z4ZO0QWJC3cqr-tPG0QciS_rkLQLPdypbl0L1k-Ot-UAF6EqRH4VtaICVDt3bGjwC8avieAw8SZzY0A',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAp45GNxNT6GJtnXiiLGtr223UyPJxCShq8WStww_1Fr4tDA9zKfjCyyJwBfabsQz19VMEGRRyimGGeruJpwjq14aUAVVM73scOqkE1ngBrH0jl-1L9E_CI2Y5alXVl4HOW-t2Tak0qLBlhnHQpaLcq6Mf6GStMBV1_QpdxYFV2Y7gFGeblvSEKvLvd21a7EIxYBK5CpXPooDA69Vp4rRxh5KHTWzPJHjqRobwWRsO349eHdb1iV9v8yg',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBAZjSNPVVry8hO3xe38l9lQ8m0ioGyBc5a_aEm4Re4swqsvjECZ9Dy1N1dxw20sY4WTuyqqsLp8Fr3ZOotTh85whc4KyYzaq9kXTRC_w7q11egRHQI0q1_PeO0ns0Pb5_q7ddAbra_NbSho1WM0kCiMKUaSalk0S6r9pcyUYB_D7k2Ulim9esI1PrWuHZ4GfLN5ooXdCs91H9CCTY0l2eHj_6-qUCcifeVKQqRjLgeqTNdsxgLc9tGaQ'
    ],
    description: 'Portas com marcenaria tridimensional em carvalho ebanizado e gaveteiro interno veludo. Ferragens alemãs ocultas com amortecimento pneumático suave.',
    designer: 'Atelier Aethel',
    material: 'Carvalho Ebanizado • Ferragens Ocultas Blum',
    inStock: true,
    stockCount: 6,
    featured: true,
    dimensions: {
      width: 220,
      height: 78,
      depth: 52,
      weight: 84
    },
    colorSwatches: [
      { name: 'Preto Ébano', color: '#201F1E' },
      { name: 'Nogueira Natural', color: '#5A3825' }
    ],
    specs: {
      'Portas': '4 portas facetadas origami',
      'Gavetas Internas': '2 gavetas com revestimento aveludado',
      'Dimensões': '220 x 52 x 78 cm'
    }
  },
  {
    id: 'cad-oxford',
    sku: 'CAD-OXF-010',
    title: 'Cadeira Oxford Presidente',
    category: 'Escritório & Home Office',
    ambiente: 'Escritório & Estúdio',
    price: 32500,
    originalPrice: undefined,
    rating: 4.8,
    reviewCount: 16,
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCvrotGKaR8AeRoWMdD1oz-pau3-NO2TNFzzKWLZuREX_8fvvi9IwWiZi6Q2PKMmEkqF-7ByPm2M4KavW672kVImoKQFIPUsPF5jIQh7jivMISlwgRGLEd98z4M8dtxINxsNM6tkU6025CnLUgvAlUOzgFj33H6Q3OeoWK1DMkNw5pIzL1zULxlVQyvE1SgQZVxK_kKrMAmyqUehwLQsNHxidvGgqL4P64KuqySNoebP0XRUS30os7wKA'
    ],
    description: 'Couro italiano pigmentado preto, suporte lombar anatômico e mecanismo sincronizado alemão em alumínio fundido polido.',
    designer: 'Linha Executiva',
    material: 'Couro Legítimo Italiano • Alumínio Injetado',
    badge: 'Linha Executiva',
    inStock: true,
    stockCount: 12,
    dimensions: {
      width: 68,
      height: 125,
      depth: 68,
      weight: 24
    },
    colorSwatches: [
      { name: 'Preto', color: '#111111' },
      { name: 'Castanho Nobre', color: '#5D4037' }
    ],
    specs: {
      'Mecanismo': 'Sincronizado com 5 posições de bloqueio',
      'Base': 'Alumínio polido de 5 raios',
      'Garantia': '5 anos de respaldo corporativo'
    }
  },
  {
    id: 'lum-vertice',
    sku: 'LUM-VER-009',
    title: 'Luminária de Piso Vértice',
    category: 'Decoração & Iluminação',
    ambiente: 'Sala de Estar',
    price: 16800,
    originalPrice: undefined,
    rating: 4.9,
    reviewCount: 20,
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBwzpcBriXZYjl1O5yNKRyOaQTw7jPSTBjihARIYQtT8vi7WSqQ2k74if7Xmoy9P2phUoguPtlEj-tZXrx8lEeIUcK1ONQXjNtoqf6M3HC2v2KfW7pNehgZ-2ufyt7vEhFhYHW21EMZrpjRtmATU2GZFQKsiFS7oa6LQx0rmTzyElCYS-bNXVYGu7-BjyLn6U9PC9cf_4BY8iRLYxw01JCOad9d3-opqcg4vZOqu_ZcuZHuGYRtgK5iBg'
    ],
    description: 'Coluna esbelta em latão acetinado escovado com dimerização suave por toque e base de contrapeso em granito negro fosco.',
    designer: 'Studio Luce',
    material: 'Latão Maciço Escovado • Cúpula Seda Crua',
    inStock: true,
    stockCount: 18,
    dimensions: {
      width: 35,
      height: 175,
      depth: 35,
      weight: 14
    },
    specs: {
      'Luminária': 'LED integrado 2700K quente dimerizável',
      'Consumo': '18W de alta eficiência',
      'Altura': '175 cm'
    }
  },
  {
    id: 'mes-director',
    sku: 'MES-DIR-011',
    title: 'Mesa Executiva Director',
    category: 'Escritório & Home Office',
    ambiente: 'Escritório & Estúdio',
    price: 58000,
    originalPrice: 65000,
    rating: 5.0,
    reviewCount: 9,
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDcQpbs47lkIUlt-kH5pGlSEkAvqG0j773Qh_kSleAx8SXQVFCJTdwLgS-X89lDE6Zt6rnGW5zWHyFlzXHr6upjtqCdkxShpXy9Pay-FSZnQiOYl4wUPxM8q3xj_0-Kw80v0vzNsFFfRGFpQUhIFR5k74PsW3o1L5IDmYjau7FmxtI5FPEu6y-5sqyRapKNAUNeCkqVdFEK1M52mH0HFpQuSixB20Xha1TC-2ONd-rzz0EJ7FK2J-y1lA'
    ],
    description: 'Nogueira escurecida com calha interna para conectividade oculta e gaveteiro invisível com chave eletrônica por aproximação.',
    designer: 'Linha Corporativa',
    material: 'Nogueira Escura • Couro Embutido',
    badge: 'B2B Ready',
    inStock: true,
    stockCount: 7,
    dimensions: {
      width: 240,
      height: 75,
      depth: 100,
      weight: 110
    },
    specs: {
      'Conectividade': '4 tomadas internacionais + USB-C PD 100W',
      'Dimensões': '240 x 100 x 75 cm'
    }
  },
  {
    id: 'sof-napoles',
    sku: 'SOF-NAP-012',
    title: 'Sofá Chaise Nápoles Outdoor',
    category: 'Sofás & Chaise',
    ambiente: 'Área Externa & Lounge',
    price: 64000,
    originalPrice: 72000,
    rating: 4.7,
    reviewCount: 14,
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCIC4pZlbsXek45DzgqAW0bnHbjMOxj3w_gv2_BseGcNA7B7kc0WuTgIShF88WRFOo-StW2q9W-g9RtPK0fo7OJ9fLEqoxCYbIVrsLXAw_vZ_aCnoXiI7sWehxonqdGVAm6rG_npdwYsTLbBAh9XFKNUvHEyNdEEAzh764jOps_ZeYCYOvZ-vU-7eQEKN1tVRoSyg2GiyCmH2cRG668c04gsNxH71S1yekv-HPultCJpqwf-3rPi_mF8w'
    ],
    description: 'Estrutura em alumínio anodizado marítimo e tramas de corda náutica resistente a intempéries e raios UV. Almofadas drenáveis impermeáveis.',
    designer: 'Linha Litorânea',
    material: 'Alumínio Náutico • Corda Hidrorrepelente',
    badge: 'Resistência UV',
    inStock: true,
    stockCount: 6,
    dimensions: {
      width: 260,
      height: 72,
      depth: 110,
      weight: 48
    },
    colorSwatches: [
      { name: 'Areia', color: '#B9B3A7' },
      { name: 'Grafite Marítimo', color: '#2F3438' }
    ],
    specs: {
      'Resistência': 'Anti-corrosão salina, testado em Beira e Pemba',
      'Tecido': 'Sunbrella® com tratamento antimofo'
    }
  },
  {
    id: 'tap-tear',
    sku: 'TAP-TEA-013',
    title: 'Tapete Tear em Lã & Juta',
    category: 'Decoração & Iluminação',
    ambiente: 'Sala de Estar',
    price: 24500,
    originalPrice: 28900,
    rating: 4.9,
    reviewCount: 18,
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAGVYJvKdYGZdyY_T4X8uRJdCmsKvA77uufN0zBXf13Bi86jBEChoThHyNckoOnC4Pj9MX4f2_PQBVN5_woto4NAtvpiEx54uwwzvpSeBvsXH29hIkgg1nQooTx_x-W2Ss_qJu2znAnqL16b6pKfvHA4_kKFphji67XfS6thLbF0FRQJobVQ7cl2wjR5tcu5mt8UI6h0pvBc1_UI8s6caZEpfGJfUlhhiZazLOQllJJq7y2sChoXESHhA'
    ],
    description: 'Trama manual artesanal em fibras naturais não tingidas de lã da Nova Zelândia e juta dourada. Toque orgânico e conforto térmico.',
    designer: 'Tapeçaria Aethel',
    material: 'Lã Virgem • Juta Natural 300x200cm',
    inStock: true,
    stockCount: 10,
    dimensions: {
      width: 300,
      height: 1.5,
      depth: 200,
      weight: 18
    },
    specs: {
      'Dimensões': '300 x 200 cm',
      'Composição': '70% lã pura, 30% juta',
      'Manufatura': 'Tear manual tradicional'
    }
  }
];

export const SHOWROOM_LOCATIONS: ShowroomLocation[] = [
  {
    id: 'maputo-flagship',
    provinceKey: 'maputo',
    provinceName: 'Maputo Cidade',
    cityName: 'Maputo',
    name: 'Pavilhão Central & Showroom Flagship Polana',
    address: 'Av. Julius Nyerere, 412, Edifício Jatobá (Acesso Térreo e Mezanino Curatorial)',
    phone: '+258 84 000 9200',
    email: 'concierge@aethelstudio.com',
    hours: 'Terça a Sábado: 09h00 às 19h00 (Segundas sob agendamento)',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC5-Ks5K41_yb3W74U5GOIMN0dNHgZ7GD_rsEW6_bi0Y7BdFAankhsQAMS5NPiNYrzyRs-1fv7WE4gFiUDHlwA-MShEEwSGzqwkd2CiUWlIV5LwRTYPLoP0wSmJUNoLh9Ajn5F284sz6FuKzYb4mmwveNBXWIFoTKbjuM4xiljWMGEeQPny02giBtPMKnxTBfkH2vsnAkG7YBrLR9NOiUNdtrOyxP2QaXfkc3t0BSFWa4LsKTbeHOVwgw',
    tag: 'Flagship Principal • Sede Nacional',
    badgeText: '850m² de Acervo Habitado',
    curator: 'Eng. Rui Matsinhe & Equipe de Projetos Aethel',
    curationFocus: 'Living Contemporâneo Monumental, Galeria de Mármores Nacionais & Importados, Suíte Master Integrada, Espaço Corporativo B2B e Ateliê Têxtil.',
    areasInExhibition: 'Sala de Estar Nuvola, Sala de Jantar Nogueira, Galeria Travertino, Pavilhão Polana',
    services: ['Atendimento VIP', 'Visualização 3D', 'Retirada Mostruários', 'Apoio à Especificação'],
    isFlagship: true,
    city: 'Maputo Cidade',
    title: 'Showroom Principal & Matéria Viva',
    description: 'Acervo Completo 2025, Mostra de Mármores Travertino, Suíte Master Integrada e Estúdio de Alfaiataria Têxtil.'
  },
  {
    id: 'beira-galeria',
    provinceKey: 'sofala',
    provinceName: 'Sofala',
    cityName: 'Beira',
    name: 'Galeria Aethel Beira • Canal de Moçambique',
    address: 'Av. Kruss Gomes, Ponta Gêa, Beira',
    phone: '+258 84 310 8820',
    email: 'beira@aethelstudio.com',
    hours: 'Segunda a Sexta: 08h30 - 17h30',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAMb4iOOsumADxlbanYVNXaWGVaKYcOoM-RYWwbO60xU9p5-SjLP23k7jECmzBYzCkdaZ5JHd3b2Isyg4h7D3195B0F8A2Wviz9cclXMGm4hVvt8DE606PxtR_FcgE2c8e2xUDC8Yl3cxferaHErPVVncVHf1fTTmuP36dq4fkxX8hNUOEjbrrJ1JlBtWZ1pRoTsmQeB13mfDOof3VeAs1BOJ2Reu4XKTnn6n6C6rAKfIZ6WTc7CA0JzA',
    tag: 'Sofala • Beira',
    badgeText: 'Aberto ao Público',
    curator: 'Dra. Carla Moiane',
    curationFocus: 'Marcenaria de área externa com madeiras tropicais resistentes à maresia (Chanfuta e Umbila), linha Nápoles em corda náutica e peças residenciais litorâneas.',
    city: 'Sofala / Beira',
    title: 'Galeria Conceito Litoral',
    description: 'Marcenaria de área externa com madeiras tropicais nobres resistentes a maresia e linhas náuticas.'
  },
  {
    id: 'nampula-atelie',
    provinceKey: 'nampula',
    provinceName: 'Nampula',
    cityName: 'Nampula Cidade',
    name: 'Ateliê & Showroom Aethel Nampula',
    address: 'Av. Eduardo Mondlane, Edifício Millenium, 3º Andar',
    phone: '+258 84 490 7710',
    email: 'nampula@aethelstudio.com',
    hours: 'Segunda a Sexta: 08h00 - 17h00',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCzK-Vcz7-jZ70k3G3bkyjnuRGwy1O5T8GeM_pBgg9JTr7D93HItqoF33FMD-3jCreO5zfw-IIvrcnhn4it21nYWumAHgiwubzl3xszaXPheJOA7ap-crzqOV81FuasrrJ2o3-zJZRVpfyzO9nlhKOIlwD0YRe98dWnrc2_Sr9biG_VUNBIUO6m14y7tXjc-do4WTsQ1qu46204RPuu2ewV6qwXa5UCEB6Oj_K-mDZ4L2vDPNXmrAGycw',
    tag: 'Nampula Cidade',
    badgeText: 'Sob Agendamento',
    curator: 'Arq. Hélder Silva',
    curationFocus: 'Mobiliário executivo de alto padrão para agronegócio e indústria regional. Linha Director, auditórios corporativos e salas de conselho diretivo.',
    city: 'Nampula Cidade',
    title: 'Ateliê Corporativo & Residencial',
    description: 'Linhas executivas e sob medida com atendimento privado para gabinetes e empreendimentos.'
  }
];

export const SHOWROOMS = SHOWROOM_LOCATIONS;

export const INITIAL_ACTIVE_ORDER: Order = {
  id: 'ord-2841-mz',
  orderNumber: '#AET-2025-0892',
  date: '18 Fev 2025',
  total: 139320,
  status: 'Em Trânsito Especial',
  phaseNumber: 4,
  phaseName: 'Em Trânsito Especial',
  estimatedDelivery: 'Sexta-feira, 28 de Fevereiro (10h00 - 13h00)',
  customerName: 'Arq. Beatriz Mendes',
  customerNuit: '400 892 108',
  deliveryAddress: 'Av. Armando Tivane, 1420 • 4º Andar Nascente, Polana Cimento, Maputo',
  items: [
    {
      product: AETHEL_PRODUCTS[0], // Nuvola
      quantity: 1,
      refCode: 'NVL-280-CRU',
      details: 'Linho Cru Macio • Módulos Central + Chaise Longue',
      price: 78500
    },
    {
      product: AETHEL_PRODUCTS[1], // Kyoto
      quantity: 1,
      refCode: 'KYT-ARM-OAK',
      details: 'Carvalho Maciço Fumê & Bouclé Marfim',
      price: 34820
    },
    {
      product: AETHEL_PRODUCTS[5], // Monolito
      quantity: 1,
      refCode: 'MNL-TBL-TRV',
      details: 'Mármore Travertino Navona Acetinado',
      price: 26000
    }
  ]
};
