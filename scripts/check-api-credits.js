#!/usr/bin/env node

/**
 * Script pour vérifier rapidement les crédits AILabTools
 * Usage: node scripts/check-api-credits.js
 */

require('dotenv').config({ path: '.env.local' });

const API_KEY = process.env.AILABTOOLS_API_KEY;

if (!API_KEY) {
  console.error('❌ ERREUR : AILABTOOLS_API_KEY non trouvée dans .env.local');
  process.exit(1);
}

async function checkCredits() {
  console.log('🔍 Vérification des crédits AILabTools...\n');
  console.log('🔑 API Key:', API_KEY.substring(0, 10) + '...' + API_KEY.substring(API_KEY.length - 4));

  // Essayer plusieurs endpoints possibles
  const endpoints = [
    'https://api.ailabapi.com/api/common/query-balance',
    'https://www.ailabapi.com/api/common/query-balance',
    'https://ailabapi.com/api/common/query-balance',
  ];

  let response = null;
  let successEndpoint = null;

  for (const endpoint of endpoints) {
    console.log('🌐 Essai:', endpoint);
    try {
      response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'ailabapi-api-key': API_KEY,
        },
      });

      if (response.status !== 404) {
        successEndpoint = endpoint;
        console.log('✅ Endpoint trouvé!\n');
        break;
      }
    } catch (err) {
      console.log('❌ Erreur avec cet endpoint\n');
      continue;
    }
  }

  if (!response || !successEndpoint) {
    console.log('\n❌ Aucun endpoint ne fonctionne. Vérifiez la documentation AILabTools.');
    return;
  }

  try {

    console.log('📡 Status:', response.status, response.statusText);
    console.log('📍 Endpoint utilisé:', successEndpoint, '\n');

    let data;
    const contentType = response.headers.get('content-type');

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      console.log('Réponse (non-JSON):', text);
      return;
    }

    if (response.ok) {
      console.log('\n✅ Connexion réussie!\n');
      console.log('╔════════════════════════════════════════╗');
      console.log('║         CRÉDITS AILABTOOLS             ║');
      console.log('╠════════════════════════════════════════╣');

      if (data.data) {
        const balance = data.data.balance !== undefined ? data.data.balance : 'N/A';
        const totalBalance = data.data.total_balance !== undefined ? data.data.total_balance : 'N/A';

        console.log('║ Solde actuel:    ', balance.toString().padEnd(20), '║');
        console.log('║ Total crédits:   ', totalBalance.toString().padEnd(20), '║');

        if (data.data.balance_warning !== undefined) {
          console.log('║ Seuil d\'alerte:  ', data.data.balance_warning.toString().padEnd(20), '║');
        }
      }

      console.log('╚════════════════════════════════════════╝\n');

      // Avertissement si crédits faibles
      if (data.data?.balance !== undefined) {
        if (data.data.balance === 0) {
          console.log('⚠️  ATTENTION: Vous n\'avez plus de crédits!');
          console.log('💳 Rechargez vos crédits sur: https://www.ailabtools.com/dashboard\n');
        } else if (data.data.balance < 100) {
          console.log('⚠️  Crédits faibles. Pensez à recharger bientôt.\n');
        } else {
          console.log('✅ Solde de crédits suffisant.\n');
        }
      }

      console.log('📊 Réponse complète:');
      console.log(JSON.stringify(data, null, 2));
    } else {
      console.log('\n❌ Erreur API!\n');
      console.log('Réponse:', JSON.stringify(data, null, 2));

      if (response.status === 401) {
        console.log('\n⚠️  Votre clé API semble invalide.');
        console.log('Vérifiez la clé dans .env.local');
      } else if (response.status === 402) {
        console.log('\n⚠️  Crédits insuffisants.');
        console.log('Rechargez vos crédits sur https://www.ailabtools.com/dashboard');
      }
    }
  } catch (error) {
    console.error('\n❌ ERREUR lors de la requête:', error.message);
    console.error('\nDétails:', error);
  }
}

checkCredits();
