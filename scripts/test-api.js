#!/usr/bin/env node

/**
 * Script pour tester l'API AILabTools avec un appel réel
 * Usage: node scripts/test-api.js
 */

require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');

const API_KEY = process.env.AILABTOOLS_API_KEY;

if (!API_KEY) {
  console.error('❌ ERREUR : AILABTOOLS_API_KEY non trouvée dans .env.local');
  process.exit(1);
}

async function testAPI() {
  console.log('🧪 Test de l\'API AILabTools...\n');
  console.log('🔑 API Key:', API_KEY.substring(0, 10) + '...' + API_KEY.substring(API_KEY.length - 4), '\n');

  // Test 1: Simple ping sur l'endpoint de skin analysis
  console.log('📡 Test 1: Appel à l\'API Skin Analysis (sans image)');
  console.log('   Pour tester si l\'API répond et si la clé est valide\n');

  try {
    const response = await fetch('https://www.ailabapi.com/api/portrait/analysis/skin-analysis-advanced', {
      method: 'POST',
      headers: {
        'ailabapi-api-key': API_KEY,
      },
      body: new FormData(), // FormData vide juste pour tester
    });

    console.log('📊 Status:', response.status, response.statusText);

    const contentType = response.headers.get('content-type');
    console.log('📋 Content-Type:', contentType);

    let data;
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
      console.log('\n📄 Réponse JSON:');
      console.log(JSON.stringify(data, null, 2));

      // Analyser la réponse
      console.log('\n🔍 Analyse de la réponse:');

      if (response.status === 200 || response.status === 201) {
        console.log('✅ API fonctionne correctement!');
      } else if (response.status === 400) {
        console.log('⚠️  Erreur 400: Mauvaise requête (normal car pas d\'image)');
        console.log('   Mais l\'API répond et la clé semble valide!');
      } else if (response.status === 401) {
        console.log('❌ Erreur 401: Clé API invalide');
        console.log('   Vérifiez votre clé dans .env.local');
      } else if (response.status === 402) {
        console.log('❌ Erreur 402: Crédits insuffisants');
        console.log('   Rechargez vos crédits sur https://www.ailabtools.com/dashboard');
      } else if (response.status === 429) {
        console.log('⚠️  Erreur 429: Trop de requêtes');
        console.log('   Attendez quelques minutes avant de réessayer');
      } else {
        console.log('⚠️  Code inattendu:', response.status);
      }

      // Vérifier les informations de crédit dans la réponse
      if (data.credit_info || data.balance || data.remaining) {
        console.log('\n💳 Informations de crédit trouvées:');
        console.log(JSON.stringify(data.credit_info || data.balance || data.remaining, null, 2));
      }

    } else {
      const text = await response.text();
      console.log('\n📄 Réponse (texte):');
      console.log(text);
    }

  } catch (error) {
    console.error('\n❌ ERREUR:', error.message);
    console.error('\nDétails:', error);
  }

  console.log('\n' + '='.repeat(60));
  console.log('\n💡 CONSEILS:');
  console.log('   • Pour voir vos crédits, connectez-vous sur:');
  console.log('     https://www.ailabtools.com/dashboard');
  console.log('   • Documentation API:');
  console.log('     https://www.ailabtools.com/doc');
  console.log('   • Si vous voyez une erreur 401, votre clé est invalide');
  console.log('   • Si vous voyez une erreur 402, rechargez vos crédits');
  console.log('   • Si vous voyez une erreur 400, c\'est normal (pas d\'image)');
  console.log('     mais cela signifie que l\'API fonctionne!\n');
}

testAPI();
