use anchor_lang::prelude::*;

declare_id!("Zon3...mock...ZoneID");

#[program]
pub mod trap_zones {
    use super::*;

    pub fn initialize_zone(ctx: Context<InitializeZone>, zone_id: u8, defense: u64) -> Result<()> {
        let zone = &mut ctx.accounts.zone;
        zone.id = zone_id;
        zone.owner = ctx.accounts.authority.key();
        zone.defense = defense;
        zone.yield_rate = 10; // Base yield
        Ok(())
    }

    pub fn attack_zone(ctx: Context<AttackZone>, attack_power: u64) -> Result<()> {
        let zone = &mut ctx.accounts.zone;
        
        // Simple logic: reduce defense by attack power
        if zone.defense > attack_power {
            zone.defense -= attack_power;
        } else {
            // Zone captured!
            zone.defense = 50; // Reset defense for new owner
            zone.owner = ctx.accounts.attacker.key();
        }
        
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(zone_id: u8)]
pub struct InitializeZone<'info> {
    #[account(
        init, 
        payer = authority, 
        space = 8 + 1 + 32 + 8 + 8,
        seeds = [b"zone", &[zone_id]], 
        bump
    )]
    pub zone: Account<'info, Zone>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct AttackZone<'info> {
    #[account(mut)]
    pub zone: Account<'info, Zone>,
    #[account(mut)]
    pub attacker: Signer<'info>,
}

#[account]
pub struct Zone {
    pub id: u8,
    pub owner: Pubkey,
    pub defense: u64,
    pub yield_rate: u64,
}
