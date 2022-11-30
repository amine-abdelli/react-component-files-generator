import { render } from '@testing-library/react';
<%component_import%>;

const component = () => {
    return <<%component_name%> />;
};

describe('[Component] <%component_name%>', () => {
    let container: any = null;

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
    });

    afterEach(() => {
        container.remove();
        container = null;
    });

    it('should render <%component_name%> component', () => {
        render(component(), container);
    });
})