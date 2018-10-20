import React from 'react'; 

const Personality = (props) => (
	<div>
		{props.facets.map(facet => {
			if (facet.percentile > 0.8) {
				return <li key={facet.trait_id}>{facet.name}</li>
			}
		})}
	</div>
)

export default Personality;