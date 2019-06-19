#!/usr/bin/env python3
# -*- coding: utf-8 -*-

# @Author: smartdone
# @Date:   2019-06-19 16:56

from server.utils.common import singleton, cmp_to_key, compare_processes
import frida
from frida.core import Device
from _frida import Process
import json


@singleton
class DeviceUtil(object):
    def __init__(self, device_id=None, package_name=None):
        self.device: Device = None
        self.devices = None
        self.device_id: str = None
        self.process: Process = None
        self.package_name: str = None

        if device_id:
            self.setup_device(device_id=device_id)
            self.device_id = device_id
            if package_name:
                self.setup_process(package_name=package_name)
                self.package_name = package_name

    @staticmethod
    def get_devices():
        devices = frida.enumerate_devices()
        return devices

    def setup_device(self, device_id: str = None, remote: str = None):  # remote传递格式 127.0.0.1:27042
        if not remote:  # 远程设备
            if not device_id:
                self.device = frida.get_usb_device()
            else:
                self.device = frida.get_device(id=device_id)
        else:  # usb设备
            device_manager = frida.get_device_manager()
            dev = device_manager.add_remote_device(remote)
            self.device = dev

    def setup_process(self, package_name: str):  # 设置当前hook进程
        self.package_name = package_name
        proc: Process = None
        # 判定进程是否存在，不存在就先spawn
        for process in self.enumerate_process():
            _process: Process = process
            if _process.name == package_name:
                proc = _process
                break
        if not proc:
            self.device.spawn([package_name])

        self.process = proc

    def enumerate_process(self):
        processes = self.device.enumerate_processes()
        return processes

    def processes_to_json_str(self, _processes=None):
        if _processes:
            processes = _processes
        else:
            processes = self.enumerate_process()
        data = []
        for item in sorted(processes, key=cmp_to_key(compare_processes)):
            _item: Process = item
            data.append([_item.pid, _item.name])
        return json.dumps(data)

    def attach_process_and_load_script(self, script_content):
        pass
