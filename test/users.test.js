const Users = artifacts.require("Users");

contract('Users', (accounts) => {
    it('should deploy', async () => {
        const usersInstance = await Users.deployed();
        const isUser = await usersInstance.isU(accounts[0]);

        assert.equal(isUser, true, "deployer");
    });

    it('should add user', async () => {
        const usersInstance = await Users.deployed();

        const dias = 'dias-text';
        await usersInstance.createUserAccount(dias, accounts[1], "test");
        const isUser = await usersInstance.isU(accounts[1]);
        const name = await usersInstance.getName(accounts[1]);
        const role = await usersInstance.getRole(accounts[1]);
        const userDias = await usersInstance.showUser(accounts[1]);

        assert.equal(isUser, true, "added user");
        assert.equal(name, "test", "name");
        assert.equal(role, 2, "role");
        assert.equal(userDias, dias, "dias");
    });

    it('should be editable by owner', async () => {
        const usersInstance = await Users.deployed();

        const dias = 'dias-text';
        await usersInstance.createUserAccount(dias, accounts[1], "test");
        const isUser = await usersInstance.isU(accounts[1]);

        assert.equal(isUser, true, "added user");

        const diasUpdated = 'updated-dias-text';
        await usersInstance.adminEditUser(accounts[1], diasUpdated, 3);

        const userDias = await usersInstance.showUser(accounts[1]);
        const userRole = await usersInstance.getRole(accounts[1]);

        assert.equal(userDias, diasUpdated, "updated user dias");
        assert.equal(userRole, 3, "updated user role");
    });

    it('should be editable by user', async () => {
        const usersInstance = await Users.deployed();

        const dias = 'dias-text';
        await usersInstance.createUserAccount(dias, accounts[1], "test");
        const isUser = await usersInstance.isU(accounts[1]);

        assert.equal(isUser, true, "added user");

        const diasUpdated = 'updated-dias-text';
        await usersInstance.editUser(diasUpdated, {from: accounts[1]});

        const userDias = await usersInstance.showUser(accounts[1]);

        assert.equal(userDias, diasUpdated, "updated user dias");
    });

    it('should not be editable by non-owner', async () => {
        const usersInstance = await Users.deployed();

        const dias = 'dias-text';
        await usersInstance.createUserAccount(dias, accounts[1], "test");
        const isUser = await usersInstance.isU(accounts[1]);

        assert.equal(isUser, true, "added user");

        const diasUpdated = 'updated-dias-text';
        try {
            await usersInstance.adminEditUser(accounts[1], diasUpdated, 3, {from: accounts[2]});
            assert.fail("The transaction should have thrown an error");
        } catch (e) {
            assert.include(e.message, "revert", "The error message should contain 'revert'");
            return true;
        }

        assert.fail('should have thrown before');
    });

    it('should not be able to add user with zero address', async ()=> {
        const usersInstance = await Users.deployed();

        const dias = 'dias-text';
        try {
            await usersInstance.createUserAccount(dias, "0x0000000000000000000000000000000000000000", "test");
            assert.fail("The transaction should have thrown an error");
        } catch (e) {
            assert.include(e.message, "invalid address", "The error message should contain 'invalid address'");
            return true;
        }

        assert.fail('should have thrown before');
    });
})