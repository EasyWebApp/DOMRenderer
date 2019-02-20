import { parseDOM } from '../source/utility';

import View from '../source/View';

import template from './source/index.html';

import data from './source/index.json';

var view = parseDOM(template).firstElementChild.innerHTML;

/**
 * @test {View}
 */
describe('DOM View', () => {
    /**
     * @test {View#parseTree}
     * @test {View#addNode}
     */
    it('Parsing', () => {
        view = new View(view);

        Array.from(view, ({ type }) => type).should.match([
            'Attr',
            'Text',
            'View',
            'View'
        ]);

        view.should.have.properties('profile', 'job');
    });

    /**
     * @test {View#render}
     */
    it('Rendering', async () => {
        await view.render(JSON.parse(data));

        view.profile.should.be.instanceOf(View);

        view.job.should.have.length(3);
        view.job[0].should.be.instanceOf(View);

        (view + '').should.be.equal(`
    <h1>TechQuery</h1>

    <ul data-view="profile">
        <template>
            <li title="\${scope.name}">
                \${view.URL}
            </li>
            <li>\${view.title}</li>
        </template>
    <li title="TechQuery">https://tech-query.me/</li>
            <li>Web/JavaScript full-stack engineer</li></ul>

    <ol data-view="job">
        <template>
            <li>\${view.title}</li>
        </template>
    <li>freeCodeCamp</li><li>MVP</li><li>KaiYuanShe</li></ol>
`);
    });

    function getFirsts() {
        return view.topNodes
            .map(node => {
                if (node.nodeType === 1)
                    return [].find.call(
                        node.childNodes,
                        ({ innerHTML, tagName, nodeValue }) =>
                            innerHTML
                                ? tagName !== 'TEMPLATE'
                                : nodeValue.trim()
                    );
            })
            .filter(Boolean);
    }

    /**
     * @test {View#renderSub}
     */
    it('Updating', async () => {
        const first = getFirsts(),
            _data_ = JSON.parse(data);

        _data_.name = 'tech-query';
        delete _data_.profile;
        _data_.job = null;

        await view.render(_data_);

        const now = getFirsts();

        now[0].should.not.be.equal(first[0]);
        now[1].should.be.equal(first[1]);
        now.should.have.length(2);

        (view + '').should.be.equal(`
    <h1>tech-query</h1>

    <ul data-view="profile">
        <template>
            <li title="\${scope.name}">
                \${view.URL}
            </li>
            <li>\${view.title}</li>
        </template>
    <li title="TechQuery">https://tech-query.me/</li>
            <li>Web/JavaScript full-stack engineer</li></ul>

    <ol data-view="job">
        <template>
            <li>\${view.title}</li>
        </template>
    </ol>
`);
    });

    /**
     * @test {View#renderSub}
     * @test {Model#commit}
     */
    it('Sub view reusing', async () => {
        const _data_ = JSON.parse(data);

        await view.render(_data_);

        const first = getFirsts();

        _data_.job.unshift({ title: 'FYClub' });

        await view.commit('job', _data_.job);

        getFirsts().should.match(first);
        (view.job[0] + '').should.be.equal('<li>FYClub</li>');
    });

    /**
     * @test {View.instanceOf}
     */
    it('Get the View of a Node', () => {
        View.instanceOf(getFirsts()[2].firstChild).should.be.equal(view.job[0]);
    });
});
