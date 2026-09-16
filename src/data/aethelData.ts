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
      '/images/catalog/9f8e28adb01246125f37.jpg',
      '/images/catalog/a9a92f8c4870e442eeea.jpg',
      '/images/catalog/211176e911795eb08422.jpg',
      '/images/catalog/37f5aabcbcac5aa56267.jpg',
      '/images/catalog/ef1ed3295184b8c3e84f.jpg'
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
      '/images/catalog/1d6022a81c3515cd95da.jpg',
      '/images/catalog/ad6cd0d861bd36a33a98.jpg',
      '/images/catalog/36a31fdc3f797d5424b4.jpg'
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
      '/images/catalog/7169cf20755c8a828a3c.jpg',
      '/images/catalog/eb7933b99c4132240df1.jpg',
      '/images/catalog/d9839fb82a960391ce64.jpg'
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
      '/images/catalog/b74d1e59f765291757c0.jpg',
      '/images/catalog/dd2f3d21a06313c84bc7.jpg',
      '/images/catalog/674f976bad4b591b8b8d.jpg'
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
      '/images/catalog/ccd4871f2e1ab7d4c606.jpg',
      '/images/catalog/f6bb5e47360965b7cf86.jpg',
      '/images/catalog/6a1500bf1b4090459333.jpg'
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
      'Pack de 4': 'Preço calculado no carrinho'
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
      '/images/catalog/02224d021037fa196349.jpg',
      '/images/catalog/84c1fdabee8294cc9636.jpg',
      '/images/catalog/89c1c366bbc9ffb27277.jpg'
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
      '/images/catalog/503afc0f0855c154b8d9.jpg',
      '/images/catalog/13b64f98d86a2d9be304.jpg',
      '/images/catalog/7458551f47ca44081739.jpg'
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
      '/images/catalog/cfb133c8d77495550219.jpg'
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
      '/images/catalog/5731f2dc1bdb4337976d.jpg'
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
      '/images/catalog/0df60e24676012f409df.jpg'
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
      '/images/catalog/b2e00be6c493ac8c7465.jpg'
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
      '/images/catalog/967cb15d4d01ee0cb789.jpg'
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
    id: 'matola-tchumene',
    provinceKey: 'maputo',
    provinceName: 'Maputo Província',
    cityName: 'Matola',
    name: 'Eden Matola — Tchumene',
    address: 'Av. Samora Machel, Bairro Tchumene, Matola',
    phone: '+258 87 000 3388',
    email: 'esales@esm.co.mz',
    hours: 'Confirme o horário com a equipa de vendas antes da visita.',
    image: '/images/catalog/a00a7943b57f870b81f4.jpg',
    tag: 'Matola • Tchumene',
    badgeText: 'Unidade Eden / ESM',
    curator: 'Equipa Eden',
    curationFocus: 'Colchões, mobiliário, espumas e atendimento comercial Eden.',
    areasInExhibition: 'Consulte a disponibilidade antes da deslocação.',
    services: ['Vendas a retalho', 'Vendas a grosso', 'Personalização'],
    isFlagship: true,
    city: 'Matola',
    title: 'Unidade Matola',
    description: 'Unidade da Espuma de Moçambique em Tchumene, Matola.'
  },
  {
    id: 'beira-vaz',
    provinceKey: 'sofala',
    provinceName: 'Sofala',
    cityName: 'Beira',
    name: 'Eden Beira — Bairro Vaz',
    address: 'Estrada Nacional Nr. 6, Bairro Vaz, Beira',
    phone: '+258 87 000 3388',
    email: 'esales@esm.co.mz',
    hours: 'Confirme o horário com a equipa de vendas antes da visita.',
    image: '/images/catalog/fa75fb23ff9793e627ae.jpg',
    tag: 'Sofala • Beira',
    badgeText: 'Unidade Eden / ESM',
    curator: 'Equipa Eden',
    curationFocus: 'Colchões, mobiliário, espumas e atendimento comercial Eden.',
    city: 'Sofala / Beira',
    title: 'Unidade Beira',
    description: 'Unidade da Espuma de Moçambique no Bairro Vaz, Beira.'
  },
  {
    id: 'nampula-mutava-rex',
    provinceKey: 'nampula',
    provinceName: 'Nampula',
    cityName: 'Nampula Cidade',
    name: 'Eden Nampula — Mutava Rex',
    address: 'Estrada Nacional Nr. 8, Mutava Rex, Nampula',
    phone: '+258 87 000 3388',
    email: 'esales@esm.co.mz',
    hours: 'Confirme o horário com a equipa de vendas antes da visita.',
    image: '/images/catalog/ff27d6c8f619c49767fb.jpg',
    tag: 'Nampula Cidade',
    badgeText: 'Unidade Eden / ESM',
    curator: 'Equipa Eden',
    curationFocus: 'Colchões, mobiliário, espumas e atendimento comercial Eden.',
    city: 'Nampula Cidade',
    title: 'Unidade Nampula',
    description: 'Unidade da Espuma de Moçambique em Mutava Rex, Nampula.'
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
