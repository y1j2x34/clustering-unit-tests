import { expect } from 'chai'
import sinon from 'sinon';
import { api1, execute } from '../lib/fxcore'

describe('Test example', () => {
    it('simplest test case', () => {
        expect(api1()).to.be.equal('hello')
    })
    it('async test case', async () => {
        await expect(Promise.resolve(api1())).to.eventually.become('hello')
    })
    it('sinon fake', () => {
        const _this = {};
        const fake = sinon.fake.returns(_this);
        const args = [1,2,3]
        execute(fake, _this, ...args);
        expect(fake).to.be.calledOnceWith(...args);
        expect(fake.thisValues[0]).to.be.equal(_this); // ===
    })

    it('sinon spies', () => {
        const myAPI = {
            method: function() {
               return this;
           }
        };
        const spyMethod = sinon.spy(myAPI, 'method')
        const _this = myAPI;
        const args = [4,5,6]

        execute(spyMethod, _this, ...args);

        expect(spyMethod).to.be.calledOn(_this)
        expect(spyMethod).to.be.calledWith(...args)
        expect(spyMethod).to.be.returned(_this);
    })

    it('sinon mock', () => {
        const myAPI = {
            method: function() {}
        };
        const spy = sinon.spy()
        const mock = sinon.mock(myAPI);
        mock.expects('method').once().returns(myAPI);

        execute(myAPI.method);
        execute(spy);

        mock.verify();

        expect(spy).to.be.calledOnce
    })
    it('failure', () => {
        expect(1).to.be.equal(2);
    })
})