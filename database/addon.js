require('dotenv').config();
const mongoose = require('mongoose');
const Addon = require('../models/addon');

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const addons = [
    {
        name: 'Carpet Cleaning',
        description: 'Deep cleaning and shampooing of carpets to remove dirt, dust, stains, and odors.',
        includes: ['Vacuuming', 'Stain removal', 'Steam cleaning', 'Deodorizing'],
        pricing: [
            { size: 'Small Carpet (up to 5x7 ft)', price: 80 },
            { size: 'Medium Carpet (up to 8x10 ft)', price: 120 },
            { size: 'Large Carpet (above 10 ft)', price: 180 }
        ],
        image: '/images/carpet.jpg'
    },
    {
        name: 'Window Cleaning',
        description: 'Cleaning of interior and exterior windows to remove dust, fingerprints, and streaks.',
        includes: ['Frame wiping', 'Glass washing', 'Squeegee drying'],
        pricing: [
            { size: 'Small Windows (Apartment/Condo)', price: 100 },
            { size: 'Medium Windows (Single-Story House)', price: 180 },
            { size: 'Large Windows (Two-Story House/Office)', price: 250 }
        ],
        image: '/images/window.jpg'
    },
    {
        name: 'Disinfection & Sanitization',
        description: 'Full home or office sanitization to eliminate bacteria, viruses, and allergens.',
        includes: ['Fogging', 'Surface disinfecting', 'Antibacterial spray treatment'],
        pricing: [
            { size: 'Small Space (up to 500 sq ft)', price: 120 },
            { size: 'Medium Space (up to 1000 sq ft)', price: 200 },
            { size: 'Large Space (above 1000 sq ft)', price: 300 }
        ],
        image: '/images/disinfection.jpg'
    },
    {
        name: 'Kitchen Deep Cleaning',
        description: 'Intensive cleaning of the entire kitchen, including appliances, cabinets, and floors.',
        includes: ['Grease removal', 'Sink & faucet cleaning', 'Oven/stove deep cleaning', 'Fridge wipe-down'],
        pricing: [{ size: 'Full Cleaning', price: 150 }],
        image: '/images/kitchen.jpg'
    },
    {
        name: 'Bathroom Deep Cleaning',
        description: 'Thorough cleaning of toilets, sinks, showers, bathtubs, and tiles to remove grime, mold, and bacteria.',
        includes: ['Scrubbing tiles', 'Disinfecting toilet', 'Sink & mirror cleaning', 'Grout cleaning'],
        pricing: [{ size: 'Per Bathroom', price: 120 }],
        image: '/images/bathroom.jpg'
    },
    {
        name: 'Sofa & Upholstery Cleaning',
        description: 'Deep cleaning and fabric shampooing of sofas, chairs, and other upholstered furniture.',
        includes: ['Vacuuming', 'Steam cleaning', 'Deodorizing'],
        pricing: [
            { size: 'Single Seater', price: 80 },
            { size: '3-Seater Sofa', price: 150 },
            { size: 'L-Shaped Sofa', price: 220 }
        ],
        image: '/images/sofa.jpg'
    },
    {
        name: 'Mattress Cleaning',
        description: 'Dust, bacteria, and odor removal from mattresses for a fresh and hygienic sleeping surface.',
        includes: ['Steam cleaning', 'Vacuuming', 'Dust mite treatment'],
        pricing: [
            { size: 'Single/Queen Mattress', price: 120 },
            { size: 'King Mattress', price: 180 }
        ],
        image: '/images/mattress.jpg' 
    },
    {
        name: 'Post-Renovation Cleaning',
        description: 'Special cleaning service for newly renovated spaces to remove dust, debris, and construction residue.',
        includes: ['Full house dusting', 'Floor scrubbing', 'Wall wiping', 'Garbage removal'],
        pricing: [{ size: 'Starting Price', price: 500 }],
        image: '/images/post-renovation.jpg' 
    }
];

async function insertAddons() {
    try {
        await Addon.deleteMany(); // Remove old records before inserting new ones
        await Addon.insertMany(addons);
        console.log('✅ Add-ons inserted successfully!');
        mongoose.connection.close();
    } catch (err) {
        console.error('❌ Error inserting add-ons:', err);
        mongoose.connection.close();
    }
}

insertAddons();
