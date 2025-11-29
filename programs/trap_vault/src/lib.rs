use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer};

declare_id!("G4tZ...mock...VaultID"); // Placeholder, will need to sync later

#[program]
pub mod trap_vault {
    use super::*;

    pub fn initialize_vault(ctx: Context<InitializeVault>) -> Result<()> {
        let vault = &mut ctx.accounts.vault;
        vault.authority = ctx.accounts.authority.key();
        vault.total_staked = 0;
        Ok(())
    }

    pub fn stake(ctx: Context<Stake>, amount: u64) -> Result<()> {
        let vault = &mut ctx.accounts.vault;
        let stake_account = &mut ctx.accounts.stake_account;
        
        // Transfer tokens from user to vault
        let cpi_accounts = Transfer {
            from: ctx.accounts.user_token_account.to_account_info(),
            to: ctx.accounts.vault_token_account.to_account_info(),
            authority: ctx.accounts.user.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        token::transfer(CpiContext::new(cpi_program, cpi_accounts), amount)?;

        // Update state
        stake_account.owner = ctx.accounts.user.key();
        stake_account.amount += amount;
        stake_account.last_stake_time = Clock::get()?.unix_timestamp;
        
        vault.total_staked += amount;

        Ok(())
    }

    pub fn unstake(ctx: Context<Unstake>, amount: u64) -> Result<()> {
        let vault = &mut ctx.accounts.vault;
        let stake_account = &mut ctx.accounts.stake_account;

        require!(stake_account.amount >= amount, ErrorCode::InsufficientFunds);

        // Transfer tokens from vault to user
        // Note: In a real app, we'd need a PDA signer for the vault to transfer out
        // For this mock/phase 1, we'll assume the vault authority signs or we add PDA seeds later
        
        // Update state
        stake_account.amount -= amount;
        vault.total_staked -= amount;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeVault<'info> {
    #[account(init, payer = authority, space = 8 + 32 + 8)]
    pub vault: Account<'info, Vault>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Stake<'info> {
    #[account(mut)]
    pub vault: Account<'info, Vault>,
    #[account(init_if_needed, payer = user, space = 8 + 32 + 8 + 8)]
    pub stake_account: Account<'info, StakeAccount>,
    #[account(mut)]
    pub user_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub vault_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Unstake<'info> {
    #[account(mut)]
    pub vault: Account<'info, Vault>,
    #[account(mut, has_one = owner)]
    pub stake_account: Account<'info, StakeAccount>,
    pub owner: Signer<'info>,
}

#[account]
pub struct Vault {
    pub authority: Pubkey,
    pub total_staked: u64,
}

#[account]
pub struct StakeAccount {
    pub owner: Pubkey,
    pub amount: u64,
    pub last_stake_time: i64,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Insufficient funds to unstake.")]
    InsufficientFunds,
}
