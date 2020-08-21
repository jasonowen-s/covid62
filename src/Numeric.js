import React from 'react';
import * as Colors from './Colors';

function Numeric(props){
    return(
        <section className="numeric-data">
          <div className="case-number">
            <div className="case-number-value">
              {new Intl.NumberFormat('en-ID').format(props.confirmed)}
            </div>
            <div className="case-number-label" style={{color:Colors.GREEN}}>
              CONFIRMED
            </div>
          </div>
          <div className="case-number">
            <div className="case-number-value">
              {new Intl.NumberFormat('en-ID').format(props.recovered)}
            </div>
            <div className="case-number-label" style={{color:Colors.BLUE}}>
              RECOVERED
            </div>
          </div>
          <div className="case-number">
            <div className="case-number-value">
              {new Intl.NumberFormat('en-ID').format(props.deaths)}
            </div>
            <div className="case-number-label" style={{color:Colors.RED}}>
              DEATHS
            </div>
          </div>
        </section>
    );
}

export default Numeric;