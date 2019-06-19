#!/usr/bin/env python3
# -*- coding: utf-8 -*-

# @Author: smartdone
# @Date:   2019-06-19 16:56

from server.utils.common import singleton
import frida
from frida.core import Device
from _frida import Process


@singleton
class DeviceUtil(object):
    def __init__(self, device_id=None):
        self.device: Device = None
        self.devices = None
        self.device_id = None
        self.process: Process = None
        self.package_name: str = None

        if device_id:
            self.setup_device(device_id=device_id)
            self.device_id = device_id

    def get_devices(self):
        devices = frida.enumerate_devices()
        self.devices = devices
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

    def enumerate_process(self):
        processes = self.device.enumerate_processes()
        return processes

    def attach_process_and_load_script(self, script_content):
        pass
