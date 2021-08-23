import { BigNumber } from '../../utils/bignumber';
import { ElementPoolPairData } from './elementPool';
import { bnum } from '../../bmath';

// calc_out_given_in (swap)
export function _exactTokenInForTokenOut(
    amount: BigNumber,
    poolPairData: ElementPoolPairData
): BigNumber {
    // The formula below returns some dust (due to rounding errors) but when
    // we input zero the output should be zero
    if (amount.isZero()) return amount;
    const f = poolPairData.swapFee.toNumber();
    const Bi = poolPairData.balanceIn.toNumber();
    const Bo = poolPairData.balanceOut.toNumber();
    const t = getTimeTillExpiry(
        poolPairData.expiryTime,
        poolPairData.currentBlockTimestamp,
        poolPairData.unitSeconds
    );
    const Ai = amount.toNumber();
    return bnum(
        Bo -
            (Bi ** (1 - t) - (Ai + Bi) ** (1 - t) + Bo ** (1 - t)) **
                (1 / (1 - t)) -
            Math.abs(
                Ai -
                    Bo +
                    (Bi ** (1 - t) - (Ai + Bi) ** (1 - t) + Bo ** (1 - t)) **
                        (1 / (1 - t))
            ) *
                f
    );
}

// calc_in_given_out (swap)
export function _tokenInForExactTokenOut(
    amount: BigNumber,
    poolPairData: ElementPoolPairData
): BigNumber {
    // The formula below returns some dust (due to rounding errors) but when
    // we input zero the output should be zero
    if (amount.isZero()) return amount;
    const f = poolPairData.swapFee.toNumber();
    const Bi = poolPairData.balanceIn.toNumber();
    const Bo = poolPairData.balanceOut.toNumber();
    const t = getTimeTillExpiry(
        poolPairData.expiryTime,
        poolPairData.currentBlockTimestamp,
        poolPairData.unitSeconds
    );
    const Ao = amount.toNumber();
    return bnum(
        -Bi +
            (Bi ** (1 - t) + Bo ** (1 - t) - (-Ao + Bo) ** (1 - t)) **
                (1 / (1 - t)) +
            Math.abs(
                -Ao -
                    Bi +
                    (Bi ** (1 - t) + Bo ** (1 - t) - (-Ao + Bo) ** (1 - t)) **
                        (1 / (1 - t))
            ) *
                f
    );
}

/////////
/// SpotPriceAfterSwap
/////////

// PairType = 'token->token'
// SwapType = 'swapExactIn'
export function _spotPriceAfterSwapExactTokenInForTokenOut(
    amount: BigNumber,
    poolPairData: ElementPoolPairData
): BigNumber {
    const f = poolPairData.swapFee.toNumber();
    const Bi = poolPairData.balanceIn.toNumber();
    const Bo = poolPairData.balanceOut.toNumber();
    const t = getTimeTillExpiry(
        poolPairData.expiryTime,
        poolPairData.currentBlockTimestamp,
        poolPairData.unitSeconds
    );
    const Ai = amount.toNumber();
    return bnum(
        1 /
            ((Bi ** (1 - t) - (Ai + Bi) ** (1 - t) + Bo ** (1 - t)) **
                (-1 + 1 / (1 - t)) /
                (Ai + Bi) ** t -
                Math.abs(
                    1 -
                        (Bi ** (1 - t) -
                            (Ai + Bi) ** (1 - t) +
                            Bo ** (1 - t)) **
                            (-1 + 1 / (1 - t)) /
                            (Ai + Bi) ** t
                ) *
                    f)
    );
}

// PairType = 'token->token'
// SwapType = 'swapExactOut'
export function _spotPriceAfterSwapTokenInForExactTokenOut(
    amount: BigNumber,
    poolPairData: ElementPoolPairData
): BigNumber {
    const f = poolPairData.swapFee.toNumber();
    const Bi = poolPairData.balanceIn.toNumber();
    const Bo = poolPairData.balanceOut.toNumber();
    const t = getTimeTillExpiry(
        poolPairData.expiryTime,
        poolPairData.currentBlockTimestamp,
        poolPairData.unitSeconds
    );
    const Ao = amount.toNumber();
    return bnum(
        (Bi ** (1 - t) + Bo ** (1 - t) - (-Ao + Bo) ** (1 - t)) **
            (-1 + 1 / (1 - t)) /
            (-Ao + Bo) ** t +
            Math.abs(
                -1 +
                    (Bi ** (1 - t) + Bo ** (1 - t) - (-Ao + Bo) ** (1 - t)) **
                        (-1 + 1 / (1 - t)) /
                        (-Ao + Bo) ** t
            ) *
                f
    );
}

/////////
///  Derivatives of spotPriceAfterSwap
/////////

// PairType = 'token->token'
// SwapType = 'swapExactIn'
export function _derivativeSpotPriceAfterSwapExactTokenInForTokenOut(
    amount: BigNumber,
    poolPairData: ElementPoolPairData
): BigNumber {
    const f = poolPairData.swapFee.toNumber();
    const Bi = poolPairData.balanceIn.toNumber();
    const Bo = poolPairData.balanceOut.toNumber();
    const t = getTimeTillExpiry(
        poolPairData.expiryTime,
        poolPairData.currentBlockTimestamp,
        poolPairData.unitSeconds
    );
    const Ai = amount.toNumber();
    return bnum(
        -(
            (-(
                ((Bi ** (1 - t) - (Ai + Bi) ** (1 - t) + Bo ** (1 - t)) **
                    (-2 + 1 / (1 - t)) *
                    (-1 + 1 / (1 - t)) *
                    (1 - t)) /
                (Ai + Bi) ** (2 * t)
            ) -
                (Ai + Bi) ** (-1 - t) *
                    (Bi ** (1 - t) - (Ai + Bi) ** (1 - t) + Bo ** (1 - t)) **
                        (-1 + 1 / (1 - t)) *
                    t -
                f *
                    Math.abs(
                        ((Bi ** (1 - t) -
                            (Ai + Bi) ** (1 - t) +
                            Bo ** (1 - t)) **
                            (-2 + 1 / (1 - t)) *
                            (-1 + 1 / (1 - t)) *
                            (1 - t)) /
                            (Ai + Bi) ** (2 * t) +
                            (Ai + Bi) ** (-1 - t) *
                                (Bi ** (1 - t) -
                                    (Ai + Bi) ** (1 - t) +
                                    Bo ** (1 - t)) **
                                    (-1 + 1 / (1 - t)) *
                                t
                    )) /
            ((Bi ** (1 - t) - (Ai + Bi) ** (1 - t) + Bo ** (1 - t)) **
                (-1 + 1 / (1 - t)) /
                (Ai + Bi) ** t -
                Math.abs(
                    1 -
                        (Bi ** (1 - t) -
                            (Ai + Bi) ** (1 - t) +
                            Bo ** (1 - t)) **
                            (-1 + 1 / (1 - t)) /
                            (Ai + Bi) ** t
                ) *
                    f) **
                2
        )
    );
}

// PairType = 'token->token'
// SwapType = 'swapExactOut'
export function _derivativeSpotPriceAfterSwapTokenInForExactTokenOut(
    amount: BigNumber,
    poolPairData: ElementPoolPairData
): BigNumber {
    const f = poolPairData.swapFee.toNumber();
    const Bi = poolPairData.balanceIn.toNumber();
    const Bo = poolPairData.balanceOut.toNumber();
    const t = getTimeTillExpiry(
        poolPairData.expiryTime,
        poolPairData.currentBlockTimestamp,
        poolPairData.unitSeconds
    );
    const Ao = amount.toNumber();
    return bnum(
        ((Bi ** (1 - t) + Bo ** (1 - t) - (-Ao + Bo) ** (1 - t)) **
            (-2 + 1 / (1 - t)) *
            (-1 + 1 / (1 - t)) *
            (1 - t)) /
            (-Ao + Bo) ** (2 * t) +
            (-Ao + Bo) ** (-1 - t) *
                (Bi ** (1 - t) + Bo ** (1 - t) - (-Ao + Bo) ** (1 - t)) **
                    (-1 + 1 / (1 - t)) *
                t +
            f *
                Math.abs(
                    ((Bi ** (1 - t) + Bo ** (1 - t) - (-Ao + Bo) ** (1 - t)) **
                        (-2 + 1 / (1 - t)) *
                        (-1 + 1 / (1 - t)) *
                        (1 - t)) /
                        (-Ao + Bo) ** (2 * t) +
                        (-Ao + Bo) ** (-1 - t) *
                            (Bi ** (1 - t) +
                                Bo ** (1 - t) -
                                (-Ao + Bo) ** (1 - t)) **
                                (-1 + 1 / (1 - t)) *
                            t
                )
    );
}

export function getTimeTillExpiry(
    expiryTime: number,
    currentBlockTimestamp: number,
    unitSeconds: number
): number {
    let t =
        currentBlockTimestamp < expiryTime
            ? expiryTime - currentBlockTimestamp
            : 0;
    t = t / unitSeconds;
    return t;
}
