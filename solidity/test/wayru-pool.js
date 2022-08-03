const WayruPool = artifacts.require('WayruPool.sol');

contract('WayruPool', (accounts) => {
    const walletSender = accounts[1];
    const walletOwner = accounts[0];


    it('Should be add balance', async () => {
        const pool = await WayruPool.new();
        const amount = 5000;
        let initialBalance = +(await web3.eth.getBalance(pool.address));
        assert.equal(0, initialBalance);
        await pool.sendAmount(amount, { from: walletSender, value: amount });
        let poolBalance = +(await web3.eth.getBalance(pool.address));
        assert.equal(amount, poolBalance);
    })

    it('Should be show if is owner', async () => {
        const pool = await WayruPool.new();
        const resultSender = await pool.isOwner({ from: walletSender });
        assert.equal(false, resultSender);
        const resultOwner = await pool.isOwner({ from: walletOwner });
        assert.equal(true, resultOwner);
    })

    it('Should be the owner can withdraw', async () => {
        const pool = await WayruPool.new();
        const amount = 5000;
        await pool.sendAmount(amount, { from: walletSender });

        await pool.withdraw({ from: walletOwner });
        let poolBalance = +(await web3.eth.getBalance(pool.address));
        assert.equal(0, poolBalance);
    })

    it('Should not be withdraw other user', async () => {
        const pool = await WayruPool.new();
        const amount = 5000;
        await pool.sendAmount(amount, { from: walletSender });
        try {
            await pool.withdraw({ from: walletSender });
            // Can't continue
            assert.equal(true, false);
        } catch (error) {
            if (error.__proto__.name != 'AssertionError')
                assert.equal('revert', error.data.message);
            else throw error;
        }
    })

    it('Should not be withdraw if no exit without balance', async () => {
        const pool = await WayruPool.new();
        try {
            await pool.withdraw({ from: walletOwner });
            // Can't continue
            assert.equal(true, false);
        } catch (error) {
            if (error.__proto__.name != 'AssertionError')
                assert.equal('revert', error.data.message);
            else throw error;
        }
    })

    it('Should be transfer the owner of contract', async () => {
        const pool = await WayruPool.new();

        await pool.transferOwnerTo(walletSender, { from: walletOwner });
        assert.equal(false, await pool.isOwner({ from: walletOwner }));
        assert.equal(true, await pool.isOwner({ from: walletSender }));
    })

    it('Should not be transfer the owner of contract when other user try it', async () => {
        const pool = await WayruPool.new();
        try {
            await pool.transferOwnerTo(accounts[2], { from: walletSender });
            // Can't continue
            assert.equal(true, false);
        } catch (error) {
            if (error.__proto__.name != 'AssertionError')
                assert.equal('revert', error.data.message);
            else throw error;
        }
        assert.equal(true, await pool.isOwner({ from: walletOwner }));

    })


});