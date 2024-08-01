import React from 'react';
import { Spin } from 'antd';
import '../styles/progress.css'

const WorkInProgress = () => {
    return (
        <div className="work-in-progress-container">
            <div className="work-in-progress-content">
                <Spin />
                <h2>Work in Progress</h2>
                <p>We're currently working on this feature. Please check back later.</p>
            </div>
        </div>
    );
};

export default WorkInProgress;
