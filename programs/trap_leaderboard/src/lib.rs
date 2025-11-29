use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod trap_leaderboard {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let leaderboard = &mut ctx.accounts.leaderboard;
        leaderboard.authority = ctx.accounts.authority.key();
        leaderboard.total_players = 0;
        Ok(())
    }

    pub fn register_player(ctx: Context<RegisterPlayer>, trap_type: u8) -> Result<()> {
        let player_profile = &mut ctx.accounts.player_profile;
        let leaderboard = &mut ctx.accounts.leaderboard;

        player_profile.authority = ctx.accounts.player.key();
        player_profile.trap_type = trap_type;
        player_profile.score = 0;
        player_profile.last_active = Clock::get()?.unix_timestamp;
        player_profile.rank = 0; // Initial rank, updated by backend or logic

        leaderboard.total_players += 1;
        
        Ok(())
    }

    pub fn update_score(ctx: Context<UpdateScore>, new_score: u64) -> Result<()> {
        // Only authority (backend) can update score for now to prevent cheating
        // In a real decentralized game, this might verify a ZK proof or on-chain action
        let player_profile = &mut ctx.accounts.player_profile;
        player_profile.score = new_score;
        player_profile.last_active = Clock::get()?.unix_timestamp;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = authority, space = 8 + 32 + 8)]
    pub leaderboard: Account<'info, Leaderboard>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct RegisterPlayer<'info> {
    #[account(init, payer = player, space = 8 + 32 + 1 + 8 + 8 + 8)]
    pub player_profile: Account<'info, PlayerProfile>,
    #[account(mut)]
    pub leaderboard: Account<'info, Leaderboard>,
    #[account(mut)]
    pub player: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateScore<'info> {
    #[account(mut)]
    pub player_profile: Account<'info, PlayerProfile>,
    #[account(has_one = authority)]
    pub leaderboard: Account<'info, Leaderboard>,
    pub authority: Signer<'info>, // Must be the leaderboard authority (backend)
}

#[account]
pub struct Leaderboard {
    pub authority: Pubkey,
    pub total_players: u64,
}

#[account]
pub struct PlayerProfile {
    pub authority: Pubkey,
    pub trap_type: u8, // 0: Music, 1: Hustle, 2: Transport, 3: Crypto
    pub score: u64,
    pub last_active: i64,
    pub rank: u64,
}
