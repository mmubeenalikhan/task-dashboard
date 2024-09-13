const { Task } = require("../db/models");
const redis = require("../config/redisClient");
const axios = require("axios");
require("dotenv").config();
const GO_SERVICE_URL = process.env.GO_SERVICE_URL || "http://localhost:8081";

async function updateCache() {
  const tasks = await Task.findAll();
  await redis.set("tasks", JSON.stringify(tasks));
}

const getTasks = async (req, res) => {
  try {
    const cache = await redis.get("tasks");

    if (cache) {
      const allTasks = JSON.parse(cache);
      allTasks.sort((a, b) => a.id - b.id);
      console.log("Fetching from Redis cache");
      return res.json(allTasks);
    }

    console.log("Fetching from DB");
    const tasks = await Task.findAll();
    await redis.set("tasks", JSON.stringify(tasks));
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createTask = async (req, res) => {
  try {
    const task = await Task.create(req.body);
    await updateCache();
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findByPk(id);
    if (task) {
      await task.update(req.body);
      await updateCache();
      res.json(task);
    } else {
      res.status(404).json({ message: "Task not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findByPk(id);
    if (task) {
      await task.destroy();
      await updateCache();
      res.json({ message: "Task deleted" });
    } else {
      res.status(404).json({ message: "Task not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createBulkTasks = async (req, res) => {
  try {
    const { tasks } = req.body;
    console.log(tasks);
    console.log("GO", GO_SERVICE_URL);

    const goResponse = await axios.post(`${GO_SERVICE_URL}/tasks/bulk`, tasks, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    await updateCache();

    res.status(goResponse.status).json(goResponse.data);
  } catch (error) {
    console.error("Error forwarding to Go service:", error.message);

    if (error.response) {
      res.status(error.response.status).json({
        message: error.response.data || "Error from Go service",
      });
    } else {
      res.status(500).json({ message: "Failed to create tasks in bulk" });
    }
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  createBulkTasks,
};
