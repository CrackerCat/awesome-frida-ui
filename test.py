#!/usr/bin/env python3
# -*- coding: utf-8 -*-

# @Author: smartdone
# @Date:   2019-06-19 17:01

from server.utils.deviceUtils import DeviceUtil

device_util = DeviceUtil()
device_util.setup_device("18b5d40e")
for item in device_util.enumerate_process():
    print(type(item))
