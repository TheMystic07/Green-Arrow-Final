#![no_std]
use soroban_sdk::{contract, contractimpl, symbol_short, Env, Symbol};

#[contract]
pub struct TossContract;

#[contractimpl]
impl TossContract {
    pub fn transact(
        env: Env,
        from: Address,
        token: Address,
        amount: i128,
        to: Address,
        charity_account_id: u32
    ) {
        // Make sure `from` address authorized the deposit call with all the
        // arguments.
        from.require_auth();

        let percent = 2;
        let donation_amount = (amount * percent) / 100;
        let transfer_amount = amount - donation_amount;

        let charity_account_address_option: Option<Address> = env
            .storage()
            .instance()
            .get(&charity_account_id)
            .unwrap();
        if let Some(charity_account_address) = charity_account_address_option {
            // Address found, proceed with the transfer
            token::Client
                ::new(&env, &token)
                .transfer(&from, &charity_account_address, &donation_amount);
            token::Client::new(&env, &token).transfer(&from, &to, &transfer_amount);

            // Update donation amounts
            Self::set_user_donation_amount(env.clone(), from, &token, donation_amount);
            Self::set_charity_donation_amount(
                env.clone(),
                charity_account_id,
                &token,
                donation_amount
            );}}
    pub fn toss(env: Env) -> Symbol {
        let res: u64 = env.prng().gen_range(1..=100);
        if res % 2 == 0 {
            symbol_short!("Tails")
        } else {
            symbol_short!("Heads")
        }
    }
}
    