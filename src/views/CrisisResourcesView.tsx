import React, { useState, useEffect } from 'react';
import { ViewHeader } from '../components/ViewHeader';
import { ApiClient } from '../utils/ApiClient';
import { Resource } from '../types';
import { SearchIcon } from '../components/icons';
import { Card } from '../components/Card';
import { AppButton } from '../components/AppButton';

const RESOURCE_CATEGORIES = ['All', 'Crisis Support', 'Anxiety', 'Depression', 'Coping Strategies', 'Grief'];

const ResourceCard: React.FC<{ resource: Resource }> = ({ resource }) => (
    <Card className="resource-card">
        <h3>{resource.title}</h3>
        <p>{resource.description}</p>
        <div className="resource-contact">
            {resource.contact ? (
                <>
                    <span>{resource.category === 'Crisis Support' ? 'Contact:' : 'Info:'}</span>
                    <strong>{resource.contact}</strong>
                </>
            ) : (
                <AppButton variant="primary" onClick={() => window.open(resource.link, '_blank')} className="btn-sm">
                    Learn More
                </AppButton>
            )}
        </div>
    </Card>
);

export const CrisisResourcesView = () => {
    const [resources, setResources] = useState<Resource[]>([]);
    const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        setIsLoading(true);
        ApiClient.resources.getResources()
            .then(data => {
                setResources(data);
                setFilteredResources(data);
            })
            .catch(console.error)
            .finally(() => setIsLoading(false));
    }, []);

    useEffect(() => {
        let results = resources;
        if (activeCategory !== 'All') {
            results = results.filter(r => r.category === activeCategory);
        }
        if (searchTerm) {
            const lowerCaseSearchTerm = searchTerm.toLowerCase();
            results = results.filter(r =>
                r.title.toLowerCase().includes(lowerCaseSearchTerm) ||
                r.description.toLowerCase().includes(lowerCaseSearchTerm)
            );
        }
        setFilteredResources(results);
    }, [activeCategory, searchTerm, resources]);

    return (
        <>
            <ViewHeader 
                title="Resource Library" 
                subtitle="Find crisis support, educational articles, and coping strategies." 
            />

            <Card className="filter-sort-bar" style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: '1.5rem' }}>
                <div className="search-group" style={{maxWidth: '100%'}}>
                    <SearchIcon />
                    <input
                        type="search"
                        placeholder="Search resources..."
                        className="search-input"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="filter-group">
                    <label>Filter by:</label>
                    <div className="filter-buttons">
                        {RESOURCE_CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                className={activeCategory === cat ? 'active' : ''}
                                onClick={() => setActiveCategory(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </Card>

            {isLoading ? (
                <div className="loading-spinner" style={{ margin: '3rem auto' }}></div>
            ) : filteredResources.length > 0 ? (
                <div className="resource-grid">
                    {filteredResources.map(resource => (
                        <ResourceCard key={resource.id} resource={resource} />
                    ))}
                </div>
            ) : (
                <Card className="empty-state">
                    <h2>No Resources Found</h2>
                    <p>Try adjusting your search term or filter category.</p>
                </Card>
            )}
        </>
    );
};