from loggersingleton import LoggerSingleton
from os import path, makedirs
from copy import copy
import json


class Config:
    def __init__(self, config_dir_name, current_file_name, default_file_name, default_config):
        self._logger = LoggerSingleton.get_instance()
        if not path.exists(config_dir_name):
            self._logger.log("Creating config folder: " + config_dir_name)
            makedirs(config_dir_name)

        self._current_file_name = config_dir_name + "/" + current_file_name
        self._default_file_name = config_dir_name + "/" + default_file_name
        if not path.exists(self._default_file_name):
            self._logger.log("Creating default config file: " + self._default_file_name )
            Config._save_file(self._default_file_name, default_config)

        if not path.exists(self._current_file_name):
            self._logger.log("Creating config file: " + self._current_file_name)
            Config._save_file(self._current_file_name, Config._load_file(self._default_file_name))

        self._config = Config._load_file(self._current_file_name)

    def save(self):
        self._logger.log("Saving config file: " + self._current_file_name)
        Config._save_file(self._current_file_name, self._config)

    def get(self, attr):
        if attr in self._config.keys():
            return self._config[attr]

    def set(self, attr, value):
        if attr in self._config.keys():
            self._config[attr] = value

    def get_all(self):
        return copy(self._config)

    @staticmethod
    def _load_file(filename):
        f = open(filename, "rU")
        config = json.load(f)
        f.close()
        return config

    @staticmethod
    def _save_file(filename, config):
        f = open(filename, "w")
        json.dump(config, f)
        f.close()
