const WayruPool = artifacts.require('WayruPool.sol');

contract('WayruPool', (accounts)=> {
    const walletSender = accounts[1];
    const walletOwner = accounts[0];


    it('Should be add balance', async () => {
        const pool = await WayruPool.new();
        const amount = 5000;
        let initialBalance = +(await web3.eth.getBalance(pool.address));
        assert.equal(0, initialBalance);
        await pool.sendAmount(amount, {from: walletSender});
        let poolBalance = +(await web3.eth.getBalance(pool.address));
        assert.equal(amount, poolBalance);
    })

    it('Should be the owner can withdraw', async () => {
        const pool = await WayruPool.new();
        const amount = 5000;
        await pool.sendAmount(amount, {from: walletSender});

        await pool.withdraw({from: walletOwner});
        let poolBalance = +(await web3.eth.getBalance(pool.address));
        assert.equal(0, poolBalance);
    })

    it('Should not other can withdraw', async () => {
        const pool = await WayruPool.new();
        const amount = 5000;
        await pool.sendAmount(amount, {from: walletSender});

        await pool.withdraw({from: walletOwner});
        let poolBalance = +(await web3.eth.getBalance(pool.address));
        assert.equal(0, poolBalance);
    })

    

});