import React, { useCallback, useEffect, useState } from 'react';

import { Box, Card, CardContent, CardHeader, Divider, Typography } from '@mui/material';
import docsearch from '../Logos/docsearch.json'
import Lottie from 'react-lottie-player'


export const HomePage = () => {

    const [searchText, setSearchText] = useState('');
    const handleSearch = async () => {
        try {
           
            console.log('Test Search')
        } catch (error) {
            console.error('Error fetching search results:', error);
        }
    };

    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        // height: '100vh',
                        // width: id !== '000' ? '70%' : '100%',
                    }}
                >
                    <Lottie
                        loop
                        animationData={docsearch}
                        play
                        style={{ width: 300, height: 300 }}
                    />

                    <div style={{ marginBottom: '1rem' }}>
                        <input
                            type="text"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            style={{
                                border: '1px solid #ccc',
                                borderRadius: '410px',
                                padding: '0.5rem',
                                width: '40vw',
                            }}
                        />
                    </div>
                    {/* <div style={{ padding: '0.5rem', width: '700px' }}>
                        {searchResults.LangchainReply && (
                            <p>{searchResults.LangchainReply}</p>
                        )}
                    </div> */}
                    <div>
                        <button onClick={handleSearch} style={{
                            marginBottom: '1rem',
                            backgroundColor: 'blue', // Add your desired color here
                            color: 'white',
                            backgroundColor: '#0074D9',
                            border: '1px solid blue',
                            borderRadius: '4px',
                            padding: '0.5rem',
                        }}>
                            Search
                        </button>
                    </div>
                </div>
                
            </div>
        </>
    );
};
