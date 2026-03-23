// Test file for CMS endpoints
import ApiService from './api';

// Test all CMS endpoints
export const testCMSEndpoints = async () => {
  try {
    console.log('Testing CMS endpoints...\n');

    // 1. Test General CMS Content (no auth required)
    console.log('1. Testing General CMS Content:');
    try {
      const cmsResponse = await ApiService.getCMSContent();
      console.log('✅ General CMS Content:', cmsResponse.data);
    } catch (error) {
      console.log('❌ General CMS Content Error:', error);
    }

    // Test with contentType parameter
    try {
      const cmsFilteredResponse = await ApiService.getCMSContent('about-us');
      console.log('✅ General CMS Content (filtered):', cmsFilteredResponse.data);
    } catch (error) {
      console.log('❌ General CMS Content (filtered) Error:', error);
    }

    // 2. Test Terms & Conditions (auth required)
    console.log('\n2. Testing Terms & Conditions:');
    try {
      const termsResponse = await ApiService.getTermsConditions();
      console.log('✅ Terms & Conditions:', termsResponse.data);
    } catch (error) {
      console.log('❌ Terms & Conditions Error:', error);
    }

    // 3. Test Privacy Policy (auth required)
    console.log('\n3. Testing Privacy Policy:');
    try {
      const privacyResponse = await ApiService.getPrivacyPolicy();
      console.log('✅ Privacy Policy:', privacyResponse.data);
    } catch (error) {
      console.log('❌ Privacy Policy Error:', error);
    }

    // 4. Test Refund Policy (auth required)
    console.log('\n4. Testing Refund Policy:');
    try {
      const refundResponse = await ApiService.getRefundPolicy();
      console.log('✅ Refund Policy:', refundResponse.data);
    } catch (error) {
      console.log('❌ Refund Policy Error:', error);
    }

    // 5. Test About Us (auth required)
    console.log('\n5. Testing About Us:');
    try {
      const aboutResponse = await ApiService.getAboutUs();
      console.log('✅ About Us:', aboutResponse.data);
    } catch (error) {
      console.log('❌ About Us Error:', error);
    }

  } catch (error) {
    console.error('CMS endpoints test failed:', error);
  }
};

// Export for usage in components
export default testCMSEndpoints;
