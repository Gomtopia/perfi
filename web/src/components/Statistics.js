import React from 'react';
import ReactDOM from 'react-dom';
import {PieChart, Pie, LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, Tooltip} from 'recharts';

class MonthlyChart extends React.Component {

    render() {
        const data = this.props.data;

        return (
            <LineChart width={800} height={300} data={data}
                       margin={{ top: 30, right: 30, left: 20, bottom: 30 }}>
                <XAxis dataKey="month" />
                <YAxis />
                <CartesianGrid strokeDasharray="5 5"/>
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="asset" stroke="#D284BD" />
                <Line type="monotone" dataKey="liability" stroke="#FFC266" />
                <Line type="monotone" dataKey="income" stroke="#8884d8" />
                <Line type="monotone" dataKey="expense" stroke="#82ca9d" />
            </LineChart>
        );
    }
}

class ExpensePieChart extends React.Component {

    customLabel(props) {
        const {x, y, cx, fill, name, value} = props;
        return (
            <text x={x} y={y} fill={fill} textAnchor={x > cx ? 'start' : 'end'}>
                {name}: {value}
            </text>
        );
    }

    render() {
        const data = this.props.data;

        return (
            <PieChart width={800} height={250}>
                <Pie data={data} dataKey="value" cx={400} outerRadius={80} fill="#82ca9d" label={this.customLabel} />
            </PieChart>
        );
    }
}

export default class Statistics extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                monthly_data: [],
                recent_1m_expenses: []
            },
        }
    }

    componentDidMount() {
        fetch('/api/statistics')
            .then(response => response.json())
            .then(responseJson => this.setState({data: responseJson}))
            .catch((error) => console.error(error))
    }

    render() {
        const {data} = this.state;

        return (
            <div className="w-75 mx-auto">
                <div className="mt-5 mb-5">
                    <h4 className="text-center">Monthly data</h4>
                    <MonthlyChart data={data.monthly_data} />
                </div>
                <h4 className="text-center">Recent expenses for a month</h4>
                <ExpensePieChart data={data.recent_1m_expenses} />
            </div>
        );
    }
}
