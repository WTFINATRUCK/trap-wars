// Referral system utilities

export interface ReferralData {
    referralCode: string;
    referredBy: string | null;
    referrals: string[]; // List of wallet addresses referred by this user
    totalEarnings: number; // Total earned from referrals
}

const MINIMUM_STAKE_FOR_REFERRAL = 100; // $100 minimum stake
const REFERRAL_PERCENTAGE = 0.005; // 0.5%

/**
 * Generate a unique referral code from wallet address
 */
export function generateReferralCode(walletAddress: string): string {
    // Take first 4 and last 4 characters of wallet address
    return `TRAP-${walletAddress.slice(0, 4)}${walletAddress.slice(-4)}`.toUpperCase();
}

/**
 * Get referral data for a wallet
 */
export function getReferralData(walletAddress: string): ReferralData {
    if (typeof window === 'undefined') {
        return {
            referralCode: '',
            referredBy: null,
            referrals: [],
            totalEarnings: 0
        };
    }

    const stored = localStorage.getItem(`referral_${walletAddress}`);
    if (stored) {
        return JSON.parse(stored);
    }

    // Initialize new referral data
    const newData: ReferralData = {
        referralCode: generateReferralCode(walletAddress),
        referredBy: null,
        referrals: [],
        totalEarnings: 0
    };

    localStorage.setItem(`referral_${walletAddress}`, JSON.stringify(newData));
    return newData;
}

/**
 * Save referral data
 */
export function saveReferralData(walletAddress: string, data: ReferralData) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(`referral_${walletAddress}`, JSON.stringify(data));
}

/**
 * Register a new referral relationship
 */
export function registerReferral(newUserWallet: string, referrerCode: string): boolean {
    // Find the referrer by code
    const allWallets = getAllWallets(); // You'd need to track this
    const referrer = allWallets.find(w => {
        const data = getReferralData(w);
        return data.referralCode === referrerCode;
    });

    if (!referrer || referrer === newUserWallet) return false;

    // Add to referrer's list
    const referrerData = getReferralData(referrer);
    if (!referrerData.referrals.includes(newUserWallet)) {
        referrerData.referrals.push(newUserWallet);
        saveReferralData(referrer, referrerData);
    }

    // Set referredBy for new user
    const newUserData = getReferralData(newUserWallet);
    if (!newUserData.referredBy) {
        newUserData.referredBy = referrer;
        saveReferralData(newUserWallet, newUserData);
    }

    return true;
}

/**
 * Calculate and distribute referral earnings
 * Called when a referred user completes a game or earns money
 */
export function processReferralEarnings(
    userWallet: string,
    earnings: number,
    userStakedAmount: number
): number {
    const userData = getReferralData(userWallet);

    // Check if user was referred
    if (!userData.referredBy) return 0;

    // Check if user meets minimum stake requirement
    if (userStakedAmount < MINIMUM_STAKE_FOR_REFERRAL) {
        return 0;
    }

    // Calculate referral amount
    const referralAmount = earnings * REFERRAL_PERCENTAGE;

    // Add to referrer's earnings
    const referrerData = getReferralData(userData.referredBy);
    referrerData.totalEarnings += referralAmount;
    saveReferralData(userData.referredBy, referrerData);

    return referralAmount;
}

/**
 * Get referral stats for display
 */
export function getReferralStats(walletAddress: string) {
    const data = getReferralData(walletAddress);

    // Calculate active referrals (those who have staked minimum)
    const activeReferrals = data.referrals.filter(refWallet => {
        const saved = localStorage.getItem(`trapwars_${refWallet}`);
        if (!saved) return false;
        const gameState = JSON.parse(saved);
        return (gameState.stakedAmount || 0) >= MINIMUM_STAKE_FOR_REFERRAL;
    });

    return {
        totalReferrals: data.referrals.length,
        activeReferrals: activeReferrals.length,
        totalEarnings: data.totalEarnings,
        referralCode: data.referralCode,
        referredBy: data.referredBy
    };
}

/**
 * Build referral link
 */
export function getReferralLink(referralCode: string): string {
    if (typeof window === 'undefined') return '';
    const baseUrl = window.location.origin;
    return `${baseUrl}?ref=${referralCode}`;
}

/**
 * Check URL for referral code and register if present
 */
export function checkAndRegisterReferralFromUrl(userWallet: string): boolean {
    if (typeof window === 'undefined') return false;

    const params = new URLSearchParams(window.location.search);
    const refCode = params.get('ref');

    if (refCode) {
        return registerReferral(userWallet, refCode);
    }

    return false;
}

// Helper function - in production, you'd track this properly
function getAllWallets(): string[] {
    if (typeof window === 'undefined') return [];

    const wallets: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('referral_')) {
            wallets.push(key.replace('referral_', ''));
        }
    }
    return wallets;
}
