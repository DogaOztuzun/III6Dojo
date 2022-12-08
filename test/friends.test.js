const { expect } = require("chai");

let owner, user, user2;
let UserContract;
let FriendsContract;

describe('Friends', (accounts) => {
    beforeEach(async () => {
        [owner, user, user2] = await ethers.getSigners();
        const Users = await ethers.getContractFactory("s0xUsers");
        const Friends = await ethers.getContractFactory("s0xFriends");

        UserContract = await Users.deploy();
        await UserContract.deployed();

        FriendsContract = await Friends.deploy(UserContract.address);
        await FriendsContract.deployed();
    });

    it('should deploy', async () => {
        const me = await FriendsContract.showMe();
        const you = await FriendsContract.showYou(owner.address);

        expect(me).to.be.contain("s0xAdmin");
        expect(you).to.be.contain("s0xAdmin");
    });

    it('should add friend', async () => {
        await FriendsContract.follow(owner.address, user.address);

        const followingCount = await FriendsContract.doDegenzCount(owner.address);
        const followerCount = await FriendsContract.doFrenzCount(user.address);
        const friend = await FriendsContract.doShowFrenz(user.address, 0);
        const isFriend = await FriendsContract.isFrenz(user.address, owner.address);

        expect(followingCount.toNumber()).to.be.equal(1, "following count");
        expect(followerCount.toNumber()).to.be.equal(1, "follower count");
        expect(friend).to.be.equal(owner.address, "follower address");
        expect(isFriend).to.be.equal(true, "is friend");
    });
});