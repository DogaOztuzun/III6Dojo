const Users = artifacts.require("Users");
const Friends = artifacts.require("Friends");

contract('Friends', (accounts) => {
    it('should deploy', async () => {
        const usersInstance = await Users.deployed();
        const friendsInstance = await Friends.deployed(usersInstance.address);

        const me = await friendsInstance.showMe();

        assert.include(me, "s0xAdmin", "admin");
    });

    it('should add friend', async () => {
        const usersInstance = await Users.deployed();
        const friendsInstance = await Friends.deployed(usersInstance.address);

        await friendsInstance.follow(accounts[0], accounts[1]);

        const followingCount = await friendsInstance.doDegenzCount(accounts[1]);

        assert.equal(followingCount, 1, "following count");
    });
});