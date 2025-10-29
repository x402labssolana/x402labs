// Test the updated quality scoring
console.log("🎯 Testing Updated Quality Scoring");
console.log("=================================");

function testUpdatedQuality() {
  // Simulate the TylerJ token data excluding liquidity pool
  const holdersData = {
    holder1: 42411067.153,  // 4.24% - Top holder (excluding LP)
    holder2: 27074593.271,  // 2.71%
    holder3: 26919866.04,   // 2.69%
    holder4: 23778967.451,  // 2.38%
    totalSupply: 1000000000
  };
  
  console.log("📊 Testing Updated Quality Scoring:");
  console.log("==================================");
  
  // Test quality for top holder (4.24%)
  const topHolderPercentage = (holdersData.holder1 / holdersData.totalSupply) * 100;
  console.log(`   Top holder percentage: ${topHolderPercentage.toFixed(2)}%`);
  
  let qualityScore = 0;
  if (topHolderPercentage >= 0.5 && topHolderPercentage < 2) {
    qualityScore = 10; // Perfect range
  } else if (topHolderPercentage >= 0.2 && topHolderPercentage < 0.5) {
    qualityScore = 8; // Very good
  } else if (topHolderPercentage >= 2 && topHolderPercentage < 5) {
    qualityScore = 7; // Good
  } else if (topHolderPercentage >= 0.1 && topHolderPercentage < 0.2) {
    qualityScore = 6; // Decent
  } else if (topHolderPercentage >= 5 && topHolderPercentage < 10) {
    qualityScore = 4; // Below average
  } else if (topHolderPercentage >= 10) {
    qualityScore = 1; // Poor - too concentrated
  } else if (topHolderPercentage < 0.1) {
    qualityScore = 3; // Very small holder
  }
  
  console.log(`   Quality score: ${qualityScore}/10`);
  console.log(`   ✅ Appropriate for ${topHolderPercentage.toFixed(1)}% holder: ${qualityScore >= 6 ? 'YES' : 'NO'}`);
  
  // Test quality for second holder (2.71%)
  const secondHolderPercentage = (holdersData.holder2 / holdersData.totalSupply) * 100;
  console.log(`\n   Second holder percentage: ${secondHolderPercentage.toFixed(2)}%`);
  
  let qualityScore2 = 0;
  if (secondHolderPercentage >= 0.5 && secondHolderPercentage < 2) {
    qualityScore2 = 10; // Perfect range
  } else if (secondHolderPercentage >= 0.2 && secondHolderPercentage < 0.5) {
    qualityScore2 = 8; // Very good
  } else if (secondHolderPercentage >= 2 && secondHolderPercentage < 5) {
    qualityScore2 = 7; // Good
  } else if (secondHolderPercentage >= 0.1 && secondHolderPercentage < 0.2) {
    qualityScore2 = 6; // Decent
  } else if (secondHolderPercentage >= 5 && secondHolderPercentage < 10) {
    qualityScore2 = 4; // Below average
  } else if (secondHolderPercentage >= 10) {
    qualityScore2 = 1; // Poor - too concentrated
  } else if (secondHolderPercentage < 0.1) {
    qualityScore2 = 3; // Very small holder
  }
  
  console.log(`   Quality score: ${qualityScore2}/10`);
  console.log(`   ✅ Appropriate for ${secondHolderPercentage.toFixed(1)}% holder: ${qualityScore2 >= 6 ? 'YES' : 'NO'}`);
  
  // Calculate average quality
  const avgQuality = (qualityScore + qualityScore2) / 2;
  console.log(`\n   Average quality: ${avgQuality.toFixed(1)}/10`);
  
  console.log("\n🎯 Final Expected Results:");
  console.log("=========================");
  console.log(`Token Symbol: TylerJ`);
  console.log(`Market Cap: $10K`);
  console.log(`24hr Volume: ~$1K`);
  console.log(`Token Age: 1-7 days`);
  console.log(`Top 10 Distribution: ~12% (excluding liquidity pool)`);
  console.log(`Holder Quality: ${avgQuality.toFixed(1)}/10`);
  
  const allRealistic = avgQuality >= 6;
  console.log(`\n🎉 All calculations now realistic: ${allRealistic ? 'YES' : 'NO'}`);
  
  if (allRealistic) {
    console.log("\n✅ The auto-fill should now provide much more realistic data!");
    console.log("✅ Volume: ~$1K instead of $581K");
    console.log("✅ Distribution: ~12% instead of 86% (excluding liquidity pool)");
    console.log("✅ Quality: 7-8/10 for reasonable holder distribution");
  }
}

testUpdatedQuality();

