import frida, sys
import json

'''Enumeration process list'''


def enmuProcess():
    processes = frida.get_usb_device().enumerate_processes()
    pid_column_width = max(map(lambda p: len("%d" % p.pid), processes))
    line_format = "%" + str(pid_column_width) + "d  %s"
    list = []
    for process in sorted(processes, key=cmp_to_key(compare_processes)):
        list.append([process.pid, process.name])
        # process = line_format % (process.pid, process.name)
    list = json.dumps(list)
    return list


def compare_processes(a, b):
    a_has_icon = a.get_small_icon() is not None
    b_has_icon = b.get_small_icon() is not None
    if a_has_icon == b_has_icon:
        if a.name > b.name:
            return 1
        elif a.name < b.name:
            return -1
        else:
            return 0
    elif a_has_icon:
        return -1
    else:
        return 1


def cmp_to_key(mycmp):
    "Convert a cmp= function into a key= function"

    class K:
        def __init__(self, obj, *args):
            self.obj = obj

        def __lt__(self, other):
            return mycmp(self.obj, other.obj) < 0

        def __gt__(self, other):
            return mycmp(self.obj, other.obj) > 0

        def __eq__(self, other):
            return mycmp(self.obj, other.obj) == 0

        def __le__(self, other):
            return mycmp(self.obj, other.obj) <= 0

        def __ge__(self, other):
            return mycmp(self.obj, other.obj) >= 0

        def __ne__(self, other):
            return mycmp(self.obj, other.obj) != 0

    return K


'''Hook function example'''


def crack(processName):
    def on_message(message, data):
        if message['type'] == 'send':
            print("[*] {0}".format(message['payload']))
        else:
            print(message)

    jscode = """
    Java.perform(function () {
        // Function to hook is defined here
        var MainActivity = Java.use('com.example.seccon2015.rock_paper_scissors.MainActivity');

        // Whenever button is clicked
        MainActivity.onClick.implementation = function (v) {
            // Show a message to know that the function got called
            send('onClick');

            // Call the original onClick handler
            this.onClick(v);

            // Set our values after running the original onClick handler
            this.m.value = 0;
            this.n.value = 1;
            this.cnt.value = 999;

            // Log to the console that it's done, and we should have the flag!
            send('Done:' + JSON.stringify(this.cnt));
        };
    });
    """
    process = frida.get_usb_device().attach(processName)
    script = process.create_script(jscode)
    script.on('message', on_message)
    print('[*] Running CTF')
    script.load()
    sys.stdin.read()
