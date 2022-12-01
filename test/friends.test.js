const Users = artifacts.require("Users");
const Friends = artifacts.require("Friends");

contract('Friends', (accounts) => {
    it('should deploy', async () => {
        const usersInstance = await Users.deployed();
        const friendsInstance = await Friends.deployed(usersInstance.address);

        const me = await friendsInstance.showMe();
        
        assert.include(me, "s0xAdmin", "admin");
    });
});