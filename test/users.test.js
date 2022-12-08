const { expect } = require("chai");

let owner, user, user2;
let UserContract;

describe('Users', (accounts) => {
    beforeEach(async () => {
        [owner, user, user2] = await ethers.getSigners();
        const Users = await ethers.getContractFactory("s0xUsers");

        UserContract = await Users.deploy();
        await UserContract.deployed();
    });

    it('should deploy', async () => {
        const isUser = await UserContract.isU(owner.address);

        expect(isUser).to.be.equal(true);
    });

    it('should add user', async () => {
        const dias = 'dias-text';
        await expect(UserContract.createUserAccount(dias, user.address, "test")).to.emit(UserContract, 'UserCreated');

        const isUser = await UserContract.isU(user.address);
        const name = await UserContract.getName(user.address);
        const role = await UserContract.getRole(user.address);
        const userDias = await UserContract.showUser(user.address);

        expect(isUser).to.be.equal(true);
        expect(name).to.be.equal("test");
        expect(role).to.be.equal(2);
        expect(userDias).to.be.equal(dias);
    });

    it('should be editable by owner', async () => {
        const dias = 'dias-text';

        await UserContract.createUserAccount(dias, user.address, "test");
        const isUser = await UserContract.isU(user.address);

        expect(isUser).to.be.equal(true);

        const diasUpdated = 'updated-dias-text';
        await expect(UserContract.adminEditUser(user.address, diasUpdated, 3)).to.emit(UserContract, 'UserUpdated');

        const userDias = await UserContract.showUser(user.address);
        const userRole = await UserContract.getRole(user.address);

        expect(userDias).to.be.equal(diasUpdated, "updated user dias");
        expect(userRole).to.be.equal(3, "updated user role");
    });

    it('should be editable by user', async () => {
        const dias = 'dias-text';
        await UserContract.createUserAccount(dias, user.address, "test");
        const isUser = await UserContract.isU(user.address);

        expect(isUser).to.be.equal(true, "added user");

        const diasUpdated = 'updated-dias-text';
        await expect(UserContract.connect(user).editUser(diasUpdated)).to.emit(UserContract, 'UserUpdated');

        const userDias = await UserContract.showUser(user.address);

        expect(userDias).to.be.equal(diasUpdated, "updated user dias");
    });

    it('should not be editable by non-owner', async () => {
        const dias = 'dias-text';
        await UserContract.createUserAccount(dias, user.address, "test");
        const isUser = await UserContract.isU(user.address);

        expect(isUser).to.be.equal(true, "added user");

        const diasUpdated = 'updated-dias-text';

        await expect(UserContract.connect(user2).adminEditUser(user.address, diasUpdated, 3)).to.be.reverted;
    });

    it('should not be able to add user with zero address', async () => {
        const dias = 'dias-text';
        await expect(UserContract.createUserAccount(dias, "0x0000000000000000000000000000000000000000", "test")).to.be.reverted;            
    });
})