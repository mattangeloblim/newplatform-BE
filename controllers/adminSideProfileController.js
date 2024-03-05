const { fetchUserDeposit, fetchUserWithdrawal } = require('../services/adminServices');

async function getUserDeposit(req, res) {
    const { player_id, startdate, enddate } = req.body;
    try {
        const deposits = await fetchUserDeposit(player_id, startdate, enddate);

        const aggregatedDeposits = deposits.reduce((acc, deposit) => {
            // Extract date from createdAt
            const createdAt = new Date(deposit.createdAt);
            const date = new Intl.DateTimeFormat('en-US', {
                month: 'short',
                day: '2-digit'
            }).format(createdAt);
        
            // Aggregate deposits by formatted date
            if (acc[date]) {
                acc[date] += deposit.amount;
            } else {
                acc[date] = deposit.amount;
            }
            return acc;
        }, {});
        const depositProfile = Object.entries(aggregatedDeposits).map(([date, amount]) => ({
            date,
            amount
        }));

        res.json(depositProfile);
    } catch (error) {
        console.error('Error fetching deposit', error);
        res.status(500).json({ error });
    }
}

async function getUserWithdrawal(req, res) {
    const { player_id, startdate, enddate } = req.body;
    try {
        const withdrawal = await fetchUserWithdrawal(player_id, startdate, enddate);

        const aggregatedwithdrawal = withdrawal.reduce((acc, withdraw) => {
            // Extract date from createdAt
            const createdAt = new Date(withdraw.createdAt);
            const date = new Intl.DateTimeFormat('en-US', {
                month: 'short',
                day: '2-digit'
            }).format(createdAt);
        
            // Aggregate withdrawal by formatted date
            if (acc[date]) {
                acc[date] += withdraw.amount;
            } else {
                acc[date] = withdraw.amount;
            }
            return acc;
        }, {});
        const withdrawProfile = Object.entries(aggregatedwithdrawal).map(([date, amount]) => ({
            date,
            amount
        }));

        res.json(withdrawProfile);
    } catch (error) {
        console.error('Error fetching deposit', error);
        res.status(500).json({ error: 'Error fetching deposit' });
    }
}

module.exports = { getUserDeposit, getUserWithdrawal };
