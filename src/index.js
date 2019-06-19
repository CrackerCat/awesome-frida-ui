import React from 'react';
import ReactDOM from 'react-dom';
import { Layout, Menu, Button, Icon, Input, Table } from 'antd';
import './index.css';
import 'antd/dist/antd.css'
import App from './App';
import * as serviceWorker from './serviceWorker';
import axios from 'axios';
import Highlighter from 'react-highlight-words';

const { Header, Sider, Content } = Layout;
const { SubMenu } = Menu;
const data = [];

/**
 * The layout of UI by Ant Design
 */
class SiderDemo extends React.Component {
    state = {
        theme: 'dark',
        current: '1',
        visiable: false,
        tab: 0,
        pid: null,
        resp: null,
        presp: null,
        funcname: null,
        funcaddr: null,
        processname: null,
        applications: null
    };
    handleClick = e => {
        console.log('click ', e);
        this.setState({
            current: e.key,
        });
    };

    onMenuClick(falg) {
        this.setState({

            tab: falg
        })
        this.visiable = true

    }
/**
 * get server respones and data
 */
    onGetProcess() {
        axios.get(`http://127.0.0.1:8000/process/`)
            .then(data => this.setState({
                presp: data.data
            }))
            .catch(console.log("发送请求失败"));



    }

    onSubmit() {
        axios.get(`http://127.0.0.1:8000/admin/?
    pid=${this.state.pid}
    &funcname=${this.state.funcname}
    &funcaddr=${this.state.funcaddr}
    &processname=${this.state.processname}`)
            .then(data => this.setState({
                resp: data.data
            }))
            .catch(console.log("发送请求失败"));
    }

/**
 * handle the Json data,get pid and process name
 */
    getData() {
        var pdata = this.state.presp;
        // alert(data)
        //alert(data.length)
        for (var i = 0; i < pdata.length; i++) {

            data.push({
                key: i,
                pid: pdata[i][0],
                name: pdata[i][1]
            });


        }


    }
    state = {
        searchText: '',
    };

/**
 *Through filterDropdown custom column filtering function, and implement a search column way
 *
 */
getColumnSearchProps = dataIndex => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={node => {
                        this.searchInput = node;
                    }}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
                    style={{ width: 188, marginBottom: 8, display: 'block' }}
                />
                <Button
                    type="primary"
                    onClick={() => this.handleSearch(selectedKeys, confirm)}
                    icon="search"
                    size="small"
                    style={{ width: 90, marginRight: 8 }}
                >
                    Search
            </Button>
                <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                    Reset
            </Button>
            </div>
        ),
        filterIcon: filtered => (
            <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
        ),
        onFilter: (value, record) =>
            record[dataIndex]
                .toString()
                .toLowerCase()
                .includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: visible => {
            if (visible) {
                setTimeout(() => this.searchInput.select());
            }
        },
        render: text => (
            <Highlighter
                highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                searchWords={[this.state.searchText]}
                autoEscape
                textToHighlight={text.toString()}
            />
        ),
    });

    handleSearch = (selectedKeys, confirm) => {
        confirm();
        this.setState({ searchText: selectedKeys[0] });
    };

    handleReset = clearFilters => {
        clearFilters();
        this.setState({ searchText: '' });
    };


render() {
        const columns = [{
            title: 'PID',
            dataIndex: 'pid',
            key: 'pid',
            width: 300,
            ...this.getColumnSearchProps('pid'),

        }, {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            width: 300,
            ...this.getColumnSearchProps('name'),

        }];
        return (


            <div>

                <div style={{ float: "left" }}>
                    <Menu
                        theme={this.state.theme}
                        onClick={this.handleClick}
                        style={{ width: 256 }}
                        defaultSelectedKeys={['1']}
                        defaultOpenKeys={['sub1']}
                        mode="inline"
                    >

                        <SubMenu
                            key="sub1"
                            title={
                                <span>
                                    <Icon type="android" />
                                    <span>Hook</span>
                                </span>
                            }
                        >

                            <Menu.ItemGroup key="g1" title="Ordinary Hook" >
                                <Menu.Item key="1" onClick={() => this.onMenuClick(0)} >Native Hook</Menu.Item>
                                <Menu.Item key="2" onClick={() => this.onMenuClick(1)} >Inline Hook</Menu.Item>
                            </Menu.ItemGroup>
                            <Menu.ItemGroup key="g2" title="Advanced Hook">
                                <Menu.Item key="3" onClick={() => this.onMenuClick(0)}>Native Hook</Menu.Item>
                                <Menu.Item key="4" onClick={() => this.onMenuClick(1)}>Inline Hook</Menu.Item>
                            </Menu.ItemGroup>

                        </SubMenu>
                        <SubMenu
                            key="sub2"
                            title={
                                <span>
                                    <Icon type="android" />
                                    <span>Regitser</span>
                                </span>
                            }
                        >
                            <Menu.Item key="5" onClick={() => this.onMenuClick()}>Stack Trace</Menu.Item>
                            <Menu.Item key="6">Tracer</Menu.Item>

                        </SubMenu>
                        <SubMenu
                            key="sub4"
                            title={
                                <span>
                                    <Icon type="android" />
                                    <span>Unpack</span>
                                </span>
                            }
                        >
                            <Menu.Item key="9" onClick={() => this.onMenuClick(2)}>Android 4.X</Menu.Item>
                            <Menu.Item key="10" onClick={() => this.onMenuClick(2)}>Android 7.X</Menu.Item>
                            <Menu.Item key="11" onClick={() => this.onMenuClick(2)}>Android O&P</Menu.Item>

                        </SubMenu>
                        <SubMenu
                            key="sub5"
                            title={
                                <span>
                                    <Icon type="android" />
                                    <span>Frida</span>
                                </span>
                            }
                        >
                            <Menu.Item key="12" onClick={() => this.onMenuClick()}>Process Func</Menu.Item>
                            <Menu.Item key="13" onClick={() => this.onMenuClick()}>Module Func</Menu.Item>
                            <Menu.Item key="14" onClick={() => this.onMenuClick()}>Memory Func</Menu.Item>
                            <Menu.Item key="15" onClick={() => this.onMenuClick()}>Java Func</Menu.Item>
                            <Menu.Item key="16" onClick={() => this.onMenuClick()}>Interceptor Func</Menu.Item>

                        </SubMenu>
                    </Menu>
                </div>

                {/* change the style by ternary operator */}

                <div style={{ float: "left" }}>

                    {
                        this.state.tab == 0 ? (<div id='Native' style={{ border: "1px solid black", height: 450, width: 800 }} visiable={this.state.visiable}>
                            <Input.Search enterButton="Submit" addonBefore="PID:" value={this.state.pid} onChange={e => this.setState({
                                pid: e.target.value
                            })} style={{ width: 300 }} size={"large"} onSearch={this.onSubmit.bind(this)} />
                            <Input.Search enterButton="Submit" addonBefore="FuncName:" value={this.state.funcname} onChange={e => this.setState({
                                funcname: e.target.value
                            })} style={{ width: 600 }} size={"large"} onSearch={this.onSubmit.bind(this)} />
                            <Input.Search enterButton="Submit" addonBefore="ProcessName:" value={this.state.processname} onChange={e => this.setState({
                                processname: e.target.value
                            })} style={{ width: 600 }} size={"large"} onSearch={this.onSubmit.bind(this)} />
                            <div>{this.state.resp}</div>
                        </div>) : (this.state.tab == 1 ? <div id='Inline' style={{ border: "1px solid black", height: 450, width: 800 }} visiable={this.state.visiable}>
                            <Input.Search enterButton="Submit" addonBefore="PID:" value={this.state.pid} onChange={e => this.setState({
                                pid: e.target.value
                            })} style={{ width: 300 }} size={"large"} onSearch={this.onSubmit.bind(this)} />
                            <Input.Search enterButton="Submit" addonBefore="FuncAddr:" value={this.state.funcaddr} onChange={e => this.setState({
                                funcaddr: e.target.value
                            })} style={{ width: 600 }} size={"large"} onSearch={this.onSubmit.bind(this)} /></div>
                            : <div style={{ border: "1px solid black", height: 450, width: 800 }} visiable={this.state.visiable}>
                                <Input.Search enterButton="Submit" addonBefore="ProcessName:" value={this.state.processname} onChange={e => this.setState({
                                    processname: e.target.value
                                })} style={{ width: 600 }} size={"large"} onSearch={this.onSubmit.bind(this)} />
                            </div>)
                    }

                    <div style={{ float: "left" }}>
                        <button onClick={this.onGetProcess.bind(this)} >
                            GetProcess
            </button>
                        <button onClick={this.getData.bind(this)} >
                            DisplayData
            </button>
                        {/* <div>{this.state.presp}</div> */}


                        <Table columns={columns} dataSource={data} pagination={{ pageSize: 50 }} scroll={{ y: 240 }} />
                    </div>



                </div>
            </div>

        );
    }
}



ReactDOM.render(<SiderDemo />, document.getElementById('root'));

//ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
