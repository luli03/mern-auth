const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = (sequelize, DataTypes) => {
    const UserSchema = sequelize.define("users", {
      username: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: true,
        },
      },
      email: {
        type: DataTypes.STRING,
        validate: {
          isEmail: true,
          notEmpty: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: true,
        },
      },
      user_infos:{
        type: DataTypes.STRING
      },
      role:{
        type: DataTypes.STRING,
        defaultValue: 'user',
        validate:{
          isIn: [['admin', 'user']]
        }
      },
      verificationToken: {
        type: DataTypes.STRING
      },
      isVerified:{
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        validate: {
            notEmpty: true,
        },
      },
      verified_date:{
        type: DataTypes.DATE
      },
      passwordToken:{
        type: DataTypes.STRING
      },
      passwordTokenExpirationDate:{
        type: DataTypes.DATE
      }
    });

    // UserSchema.associate = function (models) {
    //   // associations can be defined here
    //   User.belongsToMany(models.roles, {
    //     through: "user_roles",
    //     foreignKey: "userId",
    //     otherKey: "roleId",
    //   });
    // };

    UserSchema.encryptPassword = (password) => {
        return bcrypt.hashSync(password, 10);
    };

    // Match user entered password to hashed password in database
    UserSchema.comparePassword = (password, hash) => {
      return bcrypt.compare(password, hash);
    }

    // Sign JWT and return
    UserSchema.getSignedJwtToken = (id) => {
      return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
      });
    };

    

    // UserSchema.prototype.getSignedJwtToken = async () => {
    //   return await jwt.sign({ id: this.id }, process.env.JWT_SECRET, {
    //     expiresIn: process.env.JWT_EXPIRE
    //   });
    // }

    return UserSchema;
  };