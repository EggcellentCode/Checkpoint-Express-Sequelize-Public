const db = require('./database');
const Sequelize = require('sequelize');

// Make sure you have `postgres` running!

//---------VVVV---------  your code below  ---------VVV----------

const Task = db.define('Task', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  complete: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  due: Sequelize.DATE,
});

const Owner = db.define('Owner', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
});

Task.belongsTo(Owner);
Owner.hasMany(Task);

Task.clearCompleted = async function () {
  await Task.destroy({
    where: {
      complete: true
    }
  })
};

Task.completeAll = async function () {
  return await Task.update({
    complete: true
  }, {
    where: {
      complete: false
    }
  })
};

Task.prototype.getTimeRemaining = function () {
  if (!this.due) return Infinity;
  return this.due - new Date();
};

Task.prototype.isOverdue = function () {
  if ((this.complete === true) || this.due > new Date()) return false;
  else return true;
};

Task.prototype.assignOwner = async function(owner) {
  return await this.setOwner(owner);
};

Owner.getOwnersAndTasks = async function () {
  return await Owner.findAll({
    include: Task
  })
};

Owner.prototype.getIncompleteTasks = function () {
  return Task.findAll({
    where: {
      complete: false
    }
  })
};

Owner.beforeDestroy((owner) => {
  if (owner.name === 'Grace Hopper') throw "Error";
})

//---------^^^---------  your code above  ---------^^^----------

module.exports = {
  Task,
  Owner,
};
